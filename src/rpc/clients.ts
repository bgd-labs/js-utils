import { PublicClient, createPublicClient, http } from 'viem';
import {
  mainnet,
  arbitrum,
  polygon,
  optimism,
  metis,
  base,
  sepolia,
  goerli,
  bsc,
  fantom,
  avalanche,
  gnosis,
  polygonZkEvm,
  scroll,
  avalancheFuji,
  polygonMumbai,
} from 'viem/chains';
import { ChainId } from './chainIds';

const commonConfig = { timeout: 30_000 };

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_MAINNET, commonConfig),
});

export const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.RPC_ARBITRUM, commonConfig),
});

export const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.RPC_POLYGON, commonConfig),
});

export const optimismClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.RPC_OPTIMISM, commonConfig),
});

export const metisClient = createPublicClient({
  chain: metis,
  transport: http(process.env.RPC_METIS, commonConfig),
});

export const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_BASE, commonConfig),
});

export const fantomClient = createPublicClient({
  chain: fantom,
  transport: http(process.env.RPC_FANTOM, commonConfig),
});

export const bnbClient = createPublicClient({
  chain: bsc,
  transport: http(process.env.RPC_BNB, commonConfig),
});

export const avalancheClient = createPublicClient({
  chain: avalanche,
  transport: http(process.env.RPC_AVALANCHE, commonConfig),
});

export const gnosisClient = createPublicClient({
  chain: gnosis,
  transport: http(process.env.RPC_GNOSIS, commonConfig),
});

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_SEPOLIA, commonConfig),
});

export const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(process.env.RPC_GOERLI, commonConfig),
});

export const scrollClient = createPublicClient({
  chain: scroll,
  transport: http(process.env.RPC_SCROLL, commonConfig),
});

export const zkEVMClient = createPublicClient({
  chain: polygonZkEvm,
  transport: http(process.env.RPC_ZKEVM, commonConfig),
});

export const fujiClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(process.env.RPC_FUJI, commonConfig),
});

export const mumbaiClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(process.env.RPC_MUMBAI, commonConfig),
});

export const CHAIN_ID_CLIENT_MAP: Record<number, PublicClient> = {
  [ChainId.mainnet]: mainnetClient,
  [ChainId.arbitrum_one]: arbitrumClient,
  [ChainId.polygon]: polygonClient,
  [ChainId.optimism]: optimismClient,
  [ChainId.metis]: metisClient,
  [ChainId.base]: baseClient,
  [ChainId.sepolia]: sepoliaClient,
  [ChainId.goerli]: goerliClient,
  [ChainId.fantom]: fantomClient,
  [ChainId.bnb]: bnbClient,
  [ChainId.avalanche]: avalancheClient,
  [ChainId.gnosis]: gnosisClient,
  [ChainId.scroll]: scrollClient,
  [ChainId.zkEVM]: zkEVMClient,
  [ChainId.fuji]: fujiClient,
  [ChainId.mumbai]: mumbaiClient,
} as const;
