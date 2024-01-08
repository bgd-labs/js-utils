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
} from 'viem/chains';
import { ChainId } from './chainIds';

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'), //process.env.RPC_MAINNET),
});

export const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.RPC_ARBITRUM),
});

export const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.RPC_POLYGON),
});

export const optimismClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.RPC_OPTIMISM),
});

export const metisClient = createPublicClient({
  chain: metis,
  transport: http(process.env.RPC_METIS),
});

export const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_BASE),
});

export const fantomClient = createPublicClient({
  chain: fantom,
  transport: http(process.env.RPC_FANTOM),
});

export const bnbClient = createPublicClient({
  chain: bsc,
  transport: http(process.env.RPC_BNB),
});

export const avalancheClient = createPublicClient({
  chain: avalanche,
  transport: http(process.env.RPC_AVALANCHE),
});

export const gnosisClient = createPublicClient({
  chain: gnosis,
  transport: http(process.env.RPC_GNOSIS),
});

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_SEPOLIA),
});

export const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(process.env.RPC_GOERLI),
});

export const scrollClient = createPublicClient({
  chain: scroll,
  transport: http(process.env.RPC_SCROLL),
});

export const zkEVMClient = createPublicClient({
  chain: polygonZkEvm,
  transport: http(process.env.RPC_ZKEVM),
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
} as const;
