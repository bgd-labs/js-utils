import { describe, it, expect } from 'vitest';
import {
  getContractDeploymentBlock,
  getBlockAtTimestamp,
  getPastLogsRecursive,
} from './helpers';
import { mainnetClient } from './clients';
import { getAbiItem } from 'viem';
import { IPoolV1_ABI } from './mocks/IPoolV1';

describe('helpers', () => {
  it(
    'getContractDeploymentBlock',
    async () => {
      const delta = 1000n;
      const result = await getContractDeploymentBlock(
        mainnetClient,
        '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        11470216n,
        11475216n,
        delta,
      );
      expect(Number(result)).lte(Number(11473116n));
      expect(Number(11473116n - result)).lte(Number(delta)); // exact would be 11473216n
    },
    { timeout: 20000 },
  );

  it('getBlockAtTimestamp', async () => {
    const delta = 1000n;
    const result = await getBlockAtTimestamp(
      mainnetClient,
      1704488567n,
      18933610n,
      18953610n,
      delta,
    );

    // exact would be 18943610
    expect(Number(result.number)).lte(18943610);
    expect(Number(1704488567n - result.timestamp)).lte(Number(delta));
  });

  it(
    'getPastLogsRecursive',
    async () => {
      const logs = await getPastLogsRecursive(
        mainnetClient,
        [getAbiItem({ abi: IPoolV1_ABI, name: 'Borrow' })],
        '0x398eC7346DcD622eDc5ae82352F02bE94C62d119', // v1 pool
        9241022n,
        9341022n,
      );

      expect(logs).toMatchSnapshot();
    },
    { timeout: 20000 },
  );
});
