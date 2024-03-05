import { createClient, http } from 'viem';
import {
  mainnet,
  arbitrum,
  polygon,
  optimism,
  metis,
  base,
  baseSepolia,
  sepolia,
  goerli,
  bsc,
  fantom,
  avalanche,
  gnosis,
  polygonZkEvm,
  scroll,
  celo,
  zkSync,
  avalancheFuji,
  polygonMumbai,
  harmonyOne,
  arbitrumGoerli,
  optimismGoerli,
  optimismSepolia,
  scrollSepolia,
  fantomTestnet,
  arbitrumSepolia,
} from 'viem/chains';
import { ChainId } from './chainIds';
import { Client } from 'viem';

const commonConfig = { timeout: 30_000 };

export const mainnetClient = createClient({
  chain: mainnet,
  transport: http(process.env.RPC_MAINNET, commonConfig),
});

export const arbitrumClient = createClient({
  chain: arbitrum,
  transport: http(process.env.RPC_ARBITRUM, commonConfig),
});

export const polygonClient = createClient({
  chain: polygon,
  transport: http(process.env.RPC_POLYGON, commonConfig),
});

export const optimismClient = createClient({
  chain: optimism,
  transport: http(process.env.RPC_OPTIMISM, commonConfig),
});

export const metisClient = createClient({
  chain: metis,
  transport: http(process.env.RPC_METIS, commonConfig),
});

export const baseClient = createClient({
  chain: base,
  transport: http(process.env.RPC_BASE, commonConfig),
});

export const fantomClient = createClient({
  chain: fantom,
  transport: http(process.env.RPC_FANTOM, commonConfig),
});

export const bnbClient = createClient({
  chain: bsc,
  transport: http(process.env.RPC_BNB, commonConfig),
});

export const avalancheClient = createClient({
  chain: avalanche,
  transport: http(process.env.RPC_AVALANCHE, commonConfig),
});

export const gnosisClient = createClient({
  chain: gnosis,
  transport: http(process.env.RPC_GNOSIS, commonConfig),
});

export const scrollClient = createClient({
  chain: scroll,
  transport: http(process.env.RPC_SCROLL, commonConfig),
});

export const zkEVMClient = createClient({
  chain: polygonZkEvm,
  transport: http(process.env.RPC_ZKEVM, commonConfig),
});

export const celoClient = createClient({
  chain: celo,
  transport: http(process.env.RPC_CELO, commonConfig),
});

export const zkSyncClient = createClient({
  chain: zkSync,
  transport: http(process.env.RPC_ZKSYNC, commonConfig),
});

export const harmonyClient = createClient({
  chain: harmonyOne,
  transport: http(process.env.RPC_HARMONY, commonConfig),
});

// testnets
export const fujiClient = createClient({
  chain: avalancheFuji,
  transport: http(process.env.RPC_FUJI, commonConfig),
});

export const mumbaiClient = createClient({
  chain: polygonMumbai,
  transport: http(process.env.RPC_MUMBAI, commonConfig),
});

export const sepoliaClient = createClient({
  chain: sepolia,
  transport: http(process.env.RPC_SEPOLIA, commonConfig),
});

export const goerliClient = createClient({
  chain: goerli,
  transport: http(process.env.RPC_GOERLI, commonConfig),
});

export const arbitrumGoerliClient = createClient({
  chain: arbitrumGoerli,
  transport: http(process.env.RPC_ARBITRUM_GOERLI, commonConfig),
});

export const arbitrumSepoliaClient = createClient({
  chain: arbitrumSepolia,
  transport: http(process.env.RPC_ARBITRUM_SEPOLIA, commonConfig),
});

export const optimismGoerliClient = createClient({
  chain: optimismGoerli,
  transport: http(process.env.RPC_OPTIMISM_GOERLI, commonConfig),
});

export const optimismSepoliaClient = createClient({
  chain: optimismSepolia,
  transport: http(process.env.RPC_OPTIMISM_SEPOLIA, commonConfig),
});

export const scrollSepoliaClient = createClient({
  chain: scrollSepolia,
  transport: http(process.env.RPC_SCROLL_SEPOLIA, commonConfig),
});

export const fantomTestnetClient = createClient({
  chain: fantomTestnet,
  transport: http(process.env.RPC_FANTOM_TESTNET, commonConfig),
});

export const baseSepoliaClient = createClient({
  chain: baseSepolia,
  transport: http(process.env.RPC_BASE_SEPOLIA, commonConfig),
});

export const CHAIN_ID_CLIENT_MAP: Record<number, Client> = {
  [ChainId.mainnet]: mainnetClient,
  [ChainId.arbitrum_one]: arbitrumClient,
  [ChainId.arbitrum_goerli]: arbitrumGoerliClient,
  [ChainId.arbitrum_sepolia]: arbitrumSepoliaClient,
  [ChainId.polygon]: polygonClient,
  [ChainId.optimism]: optimismClient,
  [ChainId.optimism_goerli]: optimismGoerliClient,
  [ChainId.optimism_sepolia]: optimismSepoliaClient,
  [ChainId.metis]: metisClient,
  [ChainId.base]: baseClient,
  [ChainId.base_sepolia]: baseSepoliaClient,
  [ChainId.sepolia]: sepoliaClient,
  [ChainId.goerli]: goerliClient,
  [ChainId.fantom]: fantomClient,
  [ChainId.fantom_testnet]: fantomTestnetClient,
  [ChainId.bnb]: bnbClient,
  [ChainId.avalanche]: avalancheClient,
  [ChainId.gnosis]: gnosisClient,
  [ChainId.scroll]: scrollClient,
  [ChainId.scroll_sepolia]: scrollSepoliaClient,
  [ChainId.zkEVM]: zkEVMClient,
  [ChainId.celo]: celoClient,
  [ChainId.zkSync]: zkSyncClient,
  [ChainId.fuji]: fujiClient,
  [ChainId.mumbai]: mumbaiClient,
  [ChainId.harmony]: harmonyClient,
} as const;
