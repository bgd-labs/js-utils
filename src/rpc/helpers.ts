import { Address, GetLogsReturnType, Client, fromHex, Hex } from 'viem';
import type { AbiEvent } from 'abitype';
import { PromisePool } from '@supercharge/promise-pool';
import { getBlock, getBytecode, getLogs } from 'viem/actions';

interface GetContractDeploymentBlockArgs {
  client: Client;
  contractAddress: Address;
  fromBlock: bigint;
  toBlock: bigint;
  maxDelta: bigint;
}

/**
 * In some cases it's important to know when a contract was first seen onChain.
 * This data is hard to obtain, as it's not indexed data.
 * On way of doing it is recursively checking on an archive node when the code was first seen.
 * @param client a viem Client
 * @param fromBlock a block on which the contract is not yet deployed
 * @param toBlock a block on which the contract is deployed
 * @param contractAddress address of the contract
 * @param maxDelta the maximum block distance between the returned block and the deployment block
 * @returns a blockNumber on which the contract is not yet deployed with a max delta to when it was deployed
 */
export async function getContractDeploymentBlock({
  client,
  contractAddress,
  fromBlock,
  toBlock,
  maxDelta,
}: GetContractDeploymentBlockArgs) {
  if (fromBlock == toBlock) return fromBlock;
  if (fromBlock < toBlock) {
    const midBlock = BigInt(fromBlock + toBlock) >> BigInt(1);
    const codeMid = await getBytecode(client, {
      blockNumber: midBlock,
      address: contractAddress,
    });
    if (!codeMid) {
      if (toBlock - midBlock > maxDelta) {
        return getContractDeploymentBlock({
          client,
          contractAddress,
          fromBlock: midBlock,
          toBlock,
          maxDelta,
        });
      } else {
        return midBlock;
      }
    }
    return getContractDeploymentBlock({
      client,
      contractAddress,
      fromBlock,
      toBlock: midBlock,
      maxDelta,
    });
  }
  throw new Error('Could not find contract deployment block');
}

interface GetBlockAtTimestampArgs {
  client: Client;
  timestamp: bigint;
  fromBlock: bigint;
  toBlock: bigint;
  maxDelta: bigint;
}

/**
 * Returns a block before the specified timestamp with a maximum of maxDelta divergence
 * @param client
 * @param fromBlock
 * @param toBlock
 * @param timestamp
 * @param maxDelta
 * @returns blocknumber
 */
export async function getBlockAtTimestamp({
  client,
  timestamp,
  fromBlock,
  toBlock,
  maxDelta,
}: GetBlockAtTimestampArgs) {
  if (fromBlock <= toBlock) {
    const midBlock = BigInt(fromBlock + toBlock) >> BigInt(1);
    const block = await getBlock(client, { blockNumber: midBlock });
    if (block.timestamp > timestamp) {
      return getBlockAtTimestamp({
        client,
        timestamp,
        fromBlock,
        toBlock: midBlock,
        maxDelta,
      });
    } else {
      if (timestamp - block.timestamp < maxDelta) {
        return block;
      } else {
        return getBlockAtTimestamp({
          client,
          timestamp,
          fromBlock: midBlock,
          toBlock,
          maxDelta,
        });
      }
    }
  }
  throw new Error('Could not find matching block');
}

interface GetLogsArgs<TAbiEvents extends AbiEvent[] | undefined> {
  client: Client;
  events: TAbiEvents;
  address: Address | Address[];
  fromBlock: bigint;
  toBlock: bigint;
}

/**
 * A thin wrapper around eth_getLogs which does batching & error handing and some known scenarios
 * @param param0
 * @returns logs
 */
export async function strategicGetLogs<
  TAbiEvents extends AbiEvent[] | undefined,
>({
  client,
  events,
  address,
  fromBlock,
  toBlock,
}: GetLogsArgs<TAbiEvents>): Promise<GetLogsReturnType<undefined, TAbiEvents>> {
  if (client.transport.key === 'http') {
    const url: string = client.transport.url;
    let batchSize = 0;
    if (/llamarpc/.test(url)) batchSize = 100_000;
    if (/quiknode/.test(url)) batchSize = 10_000;
    // alchemy behaves different to other rpcs as it allows querying with infinite block range as long as the response size is below a certain threshold
    if (/alchemy/.test(url)) {
      getLogsRecursive({ client, events, address, fromBlock, toBlock });
    }
    if (batchSize > 0) {
      return getLogsInBatches({
        client,
        events,
        address,
        fromBlock,
        toBlock,
        batchSize,
      });
    }
  }
  return getLogsRecursive({ client, events, address, fromBlock, toBlock });
}

/**
 * fetches logs recursively
 */
export async function getLogsRecursive<
  TAbiEvents extends AbiEvent[] | undefined,
>({
  client,
  events,
  address,
  fromBlock,
  toBlock,
}: GetLogsArgs<TAbiEvents>): Promise<GetLogsReturnType<undefined, TAbiEvents>> {
  console.log('recursions', fromBlock, toBlock);
  if (fromBlock <= toBlock) {
    try {
      const logs = await getLogs(client, {
        fromBlock,
        toBlock,
        events,
        address,
      });
      return logs;
    } catch (error: any) {
      // for alchemy part of the details string contains sth like: [0x8d01be, 0x948ce4]
      const rangeMatch = (error.details as string)?.match(/.*\[(.*),\s*(.*)\]/);
      if (rangeMatch?.length === 3) {
        const maxBlock = fromHex(rangeMatch[2] as Hex, 'bigint');
        const arr1 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock,
          toBlock: maxBlock,
        });
        const midBlock = BigInt(maxBlock + toBlock) >> BigInt(1);

        const arr2 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: maxBlock + BigInt(1),
          toBlock: midBlock,
        });
        const arr3 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: midBlock + BigInt(1),
          toBlock,
        });
        return [...arr1, ...arr2, ...arr3];
      } else {
        // divide & conquer when issue/limit is now known
        const midBlock = BigInt(fromBlock + toBlock) >> BigInt(1);
        const arr1 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock,
          toBlock: midBlock,
        });
        const arr2 = await getLogsRecursive({
          client,
          events,
          address,
          fromBlock: midBlock + BigInt(1),
          toBlock,
        });
        return [...arr1, ...arr2];
      }
    }
  }
  return [];
}

interface GetLogsInBatchesArgs<TAbiEvents extends AbiEvent[] | undefined>
  extends GetLogsArgs<TAbiEvents> {
  batchSize: number;
}

/**
 * Fetches logs between two blocks with a given batchSize per call
 * @param client
 * @param events
 * @param address
 * @param fromBlock
 * @param toBlock
 * @param batchSize
 * @returns
 */
async function getLogsInBatches<TAbiEvents extends AbiEvent[] | undefined>({
  client,
  events,
  address,
  fromBlock,
  toBlock,
  batchSize,
}: GetLogsInBatchesArgs<TAbiEvents>) {
  const batches: { from: bigint; to: bigint }[] = [];
  for (let i = Number(fromBlock); i < Number(toBlock); i = i + batchSize) {
    batches.push({
      from: BigInt(i),
      to:
        BigInt(i + batchSize - 1) > toBlock
          ? toBlock
          : BigInt(i + batchSize - 1),
    });
  }

  // TODO: add retry logic
  const { results, errors } = await PromisePool.for(batches)
    .withConcurrency(5)
    .useCorrespondingResults()
    .process(async ({ from, to }) => {
      return getLogs(client, {
        fromBlock: from,
        toBlock: to,
        events,
        address,
      });
    });
  if (errors.length != 0) {
    console.log(errors);
    throw new Error('Error fetching logs');
  }
  return results.flat() as GetLogsReturnType<undefined, TAbiEvents>;
}
