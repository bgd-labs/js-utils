import { describe, it, expect } from 'vitest';
import { getClient, ChainId } from '@bgd-labs/rpc-env';
import {
  getContractDeploymentBlock,
  getBlockAtTimestamp,
  strategicGetLogs,
} from './helpers';
import { getAbiItem } from 'viem';
import { IPoolV1_ABI } from './mocks/IPoolV1';
import { mainnet } from 'viem/chains';

describe('helpers', () => {
  it(
    'getContractDeploymentBlock',
    async () => {
      const maxDelta = 1000n;
      const result = await getContractDeploymentBlock({
        client: getClient(ChainId.mainnet, {}),
        contractAddress: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        fromBlock: 11470216n,
        toBlock: 11475216n,
        maxDelta,
      });
      expect(Number(result)).lte(Number(11473116n));
      expect(Number(11473116n - result)).lte(Number(maxDelta)); // exact would be 11473216n
    },
    { timeout: 20000 },
  );

  it('getBlockAtTimestamp', async () => {
    const maxDelta = 1000n;
    const result = await getBlockAtTimestamp({
      client: getClient(ChainId.mainnet, {}),
      timestamp: 1704488567n,
      fromBlock: 18933610n,
      toBlock: 18953610n,
      maxDelta,
    });

    // exact would be 18943610
    expect(Number(result.number)).lte(18943610);
    expect(Number(1704488567n - result.timestamp)).lte(Number(maxDelta));
  });

  it(
    'getLogs should use batching for known rpcs',
    async () => {
      const logs = await strategicGetLogs({
        client: getClient(ChainId.mainnet, {}),
        events: [getAbiItem({ abi: IPoolV1_ABI, name: 'Borrow' })],
        address: '0x398eC7346DcD622eDc5ae82352F02bE94C62d119', // v1 pool
        fromBlock: 9241022n,
        toBlock: 9281022n,
      });
      expect(logs.length).gt(0);
      expect(logs).toMatchSnapshot();
    },
    { timeout: 60000 },
  );

  // it(
  //   'getLogs should use alchemy range',
  //   async () => {
  //     const logs = await strategicGetLogs({
  //       client: CHAIN_ID_CLIENT_MAP[mainnet.id],
  //       events: [getAbiItem({ abi: IPoolV1_ABI, name: 'Borrow' })],
  //       address: '0x398eC7346DcD622eDc5ae82352F02bE94C62d119', // v1 pool
  //       fromBlock: 9241022n,
  //       toBlock: await CHAIN_ID_CLIENT_MAP[mainnet.id].getBlockNumber(),
  //     });
  //   },
  //   { timeout: 120000 },
  // );
});
