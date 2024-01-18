import {
  Chain,
  Client,
  createClient,
  fallback,
  FallbackTransportConfig,
  http,
  HttpTransportConfig,
} from 'viem';
import {
  mainnet,
  polygon,
  avalanche,
  bsc,
  base,
  arbitrum,
  metis,
  optimism,
  gnosis,
  fantom,
  polygonMumbai,
  scroll,
  arbitrumGoerli,
  goerli,
  arbitrumSepolia,
  bscTestnet,
  optimismGoerli,
  scrollTestnet,
  scrollSepolia,
  fantomTestnet,
  avalancheFuji,
  harmonyOne,
  polygonZkEvm,
  sepolia,
} from 'viem/chains';

const viemChains = {
  mainnet,
  polygon,
  avalanche,
  bsc,
  base,
  arbitrum,
  metis,
  optimism,
  gnosis,
  fantom,
  polygonMumbai,
  scroll,
  arbitrumGoerli,
  goerli,
  arbitrumSepolia,
  bscTestnet,
  optimismGoerli,
  scrollTestnet,
  scrollSepolia,
  fantomTestnet,
  avalancheFuji,
  harmonyOne,
  polygonZkEvm,
  sepolia,
};

export const VIEM_CHAINS: Record<number, Chain> = Object.values(viemChains).reduce(
  (acc, chain) => {
    return { ...acc, [chain.id]: chain };
  },
  {},
);

const commonHttpConfig = { timeout: 30_000 };

export const commonFallBackConfig = {
  rank: false,
  retryDelay: 500,
  retryCount: 5,
};

function checkEnv(envVar?: string) {
  return envVar || '';
}

// chains RPC urls
const rpcUrls: Record<number, string[]> = {
  [mainnet.id]: [
    checkEnv(process.env.RPC_MAINNET),
    'https://blissful-purple-sky.quiknode.pro',
    'https://rpc.ankr.com/eth',
    'https://eth.nodeconnect.org',
  ],
  [polygon.id]: [
    checkEnv(process.env.RPC_POLYGON),
    'https://polygon.blockpi.network/v1/rpc/public',
    'https://polygon.llamarpc.com',
    'https://polygon-bor.publicnode.com',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
  ],
  [avalanche.id]: [
    checkEnv(process.env.RPC_AVALANCHE),
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avalanche.drpc.org',
    'https://avax.meowrpc.com',
    'https://avalanche.blockpi.network/v1/rpc/public',
  ],
  [bsc.id]: [
    checkEnv(process.env.RPC_BNB),
    'https://binance.llamarpc.com',
    'https://bsc.meowrpc.com',
  ],
  [base.id]: [
    checkEnv(process.env.RPC_BASE),
    'https://base.blockpi.network/v1/rpc/public',
    'https://base.llamarpc.com',
    'https://base-mainnet.public.blastapi.io',
    'https://base.meowrpc.com',
  ],
  [arbitrum.id]: [
    checkEnv(process.env.RPC_ARBITRUM),
    'https://arbitrum.llamarpc.com',
    'https://arb-mainnet-public.unifra.io',
    'https://endpoints.omniatech.io/v1/arbitrum/one/public',
  ],
  [metis.id]: [
    checkEnv(process.env.RPC_METIS),
    'https://metis-mainnet.public.blastapi.io',
    'https://metis.api.onfinality.io/public',
  ],
  [optimism.id]: [
    checkEnv(process.env.RPC_OPTIMISM),
    'https://optimism.blockpi.network/v1/rpc/public',
    'https://optimism.llamarpc.com',
    'https://optimism.publicnode.com',
  ],
  [gnosis.id]: [
    checkEnv(process.env.RPC_GNOSIS),
    'https://gnosis.blockpi.network/v1/rpc/public',
    'https://gnosis-mainnet.public.blastapi.io',
  ],
  [fantom.id]: [checkEnv(process.env.RPC_FANTOM)],
  [scroll.id]: [checkEnv(process.env.RPC_SCROLL)],
  [polygonZkEvm.id]: [checkEnv(process.env.RPC_ZKEVM)],
  [harmonyOne.id]: [checkEnv(process.env.RPC_HARMONY)],
  // testnets
  [goerli.id]: [
    checkEnv(process.env.RPC_GOERLI),
    'https://ethereum-goerli.publicnode.com',
    'https://goerli.blockpi.network/v1/rpc/public',
    'https://eth-goerli.public.blastapi.io',
  ],
  [sepolia.id]: [
    checkEnv(process.env.RPC_SEPOLIA),
    'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    'https://ethereum-sepolia.publicnode.com',
  ],
  [polygonMumbai.id]: [
    checkEnv(process.env.RPC_MUMBAI),
    'https://rpc.ankr.com/polygon_mumbai',
  ],
  [avalancheFuji.id]: [
    checkEnv(process.env.RPC_FUJI),
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://avalanche-fuji-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche_fuji',
  ],
  [bscTestnet.id]: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
  [arbitrumGoerli.id]: [checkEnv(process.env.RPC_ARBITRUM_GOERLI)],
  [arbitrumSepolia.id]: [checkEnv(process.env.RPC_ARBITRUM_SEPOLIA)],
  [optimismGoerli.id]: [checkEnv(process.env.RPC_OPTIMISM_GOERLI)],
  [scrollTestnet.id]: [checkEnv(process.env.RPC_SCROLL_ALPHA)],
  [scrollSepolia.id]: [checkEnv(process.env.RPC_SCROLL_SEPOLIA)],
  [fantomTestnet.id]: [checkEnv(process.env.RPC_FANTOM_TESTNET)],
};

export const createViemClient = ({
  chain,
  rpcUrl,
  withoutFallback,
  httpConfig,
  fallBackConfig,
}: {
  chain: Chain;
  rpcUrl: string;
  withoutFallback?: boolean;
  httpConfig?: HttpTransportConfig;
  fallBackConfig?: FallbackTransportConfig;
}) =>
  createClient({
    batch: {
      multicall: true,
    },
    chain: chain,
    transport: withoutFallback
      ? http(rpcUrl, httpConfig || commonHttpConfig)
      : fallback(
        [
          http(rpcUrl, httpConfig || commonHttpConfig),
          ...chain.rpcUrls.default.http
            .filter((url) => url !== rpcUrl)
            .map((url) => http(url, httpConfig || commonHttpConfig)),
        ],
        fallBackConfig || commonFallBackConfig,
      ),
  });

export const CHAIN_ID_CLIENT_MAP: Record<number, Client> = Object.entries(
  rpcUrls,
).reduce((acc, rpcUrlObject) => {
  const chainId = Number(rpcUrlObject[0]);
  const localRpcUrls = rpcUrlObject[1];
  const initialChain = VIEM_CHAINS[chainId];

  if (!initialChain) {
    throw new Error(`Can't set chain for this RPC's urls. Check if you import chain for this chain id ${chainId}`);
  }

  const chain = {
    ...initialChain,
    rpcUrls: {
      ...initialChain.rpcUrls,
      default: {
        ...initialChain.rpcUrls.default,
        http: [!!localRpcUrls[0] ? localRpcUrls[0] : initialChain.rpcUrls.default.http[0], ...localRpcUrls],
      },
    },
    // if need change gnosis explorer link, then uncomment `blockExplorers` object
    // blockExplorers: {
    //   ...initialChain.blockExplorers,
    //   default:
    //     initialChain.id === gnosis.id
    //       ? { name: 'Gnosis chain explorer', url: 'https://gnosisscan.io' }
    //       : initialChain.blockExplorers?.default ||
    //         mainnet.blockExplorers.default,
    // },
  };

  return {
    ...acc,
    [chainId]: createViemClient({
      chain,
      rpcUrl: rpcUrls[chain.id][0],
    }),
  };
}, {});
