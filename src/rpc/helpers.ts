import { Address, GetLogsReturnType, PublicClient } from 'viem';
import type { Abi, AbiEvent } from 'abitype';

interface GetContractDeploymentBlockArgs {
  client: PublicClient;
  contractAddress: Address;
  fromBlock: bigint;
  toBlock: bigint;
  maxDelta: bigint;
}

/**
 * In some cases it's important to know when a contract was first seen onChain.
 * This data is hard to obtain, as it's not indexed data.
 * On way of doing it is recursively checking on an archive node when the code was first seen.
 * @param client a viem PublicClient
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
    const codeMid = await client.getBytecode({
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
  client: PublicClient;
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
    const block = await client.getBlock({ blockNumber: midBlock });
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

interface GetLogsRecursiveArgs<TAbiEvents extends AbiEvent[] | undefined> {
  client: PublicClient;
  events: TAbiEvents;
  address: Address;
  fromBlock: bigint;
  toBlock: bigint;
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
}: GetLogsRecursiveArgs<TAbiEvents>): Promise<
  GetLogsReturnType<undefined, TAbiEvents>
> {
  if (fromBlock <= toBlock) {
    try {
      const logs = await client.getLogs({
        fromBlock,
        toBlock,
        events,
        address,
      });
      return logs;
    } catch (error: any) {
      console.log(error);
      // quicknode style errors
      if (
        error.message &&
        (error.message as string).includes(
          'eth_getLogs is limited to a 10,000 range',
        )
      ) {
        return getLogsInBatches({
          client,
          events,
          address,
          fromBlock,
          toBlock,
          batchSize: 10000,
        });
      }
      // llama style error
      if (
        error.message &&
        (error.message as string).includes(
          'query exceeds max block range 100000',
        )
      ) {
        return getLogsInBatches({
          client,
          events,
          address,
          fromBlock,
          toBlock,
          batchSize: 100000,
        });
      }
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
  return [];
}

interface GetLogsInBatchesArgs<TAbiEvents extends AbiEvent[] | undefined>
  extends GetLogsRecursiveArgs<TAbiEvents> {
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
  const logs = [];
  for (let i = Number(fromBlock); i < Number(toBlock); i = i + batchSize) {
    const logsBatch = await client.getLogs({
      fromBlock: BigInt(i),
      toBlock:
        BigInt(i + batchSize - 1) > toBlock
          ? toBlock
          : BigInt(i + batchSize - 1),
      events,
      address,
    });
    logs.push(...logsBatch);
  }
  return logs;
}
