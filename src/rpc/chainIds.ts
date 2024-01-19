import {
  mainnet,
  arbitrumGoerli,
  arbitrumSepolia,
  avalancheFuji,
  bsc,
  fantomTestnet,
  harmonyOne,
  optimismGoerli,
  polygonMumbai,
  polygonZkEvm,
  scrollSepolia,
  goerli,
  polygon,
  avalanche,
  arbitrum,
  fantom,
  optimism,
  sepolia,
  scroll,
  metis,
  base,
  gnosis,
} from 'viem/chains';

export const ChainId = {
  mainnet: mainnet.id,
  goerli: goerli.id,
  polygon: polygon.id,
  mumbai: polygonMumbai.id,
  avalanche: avalanche.id,
  fuji: avalancheFuji.id,
  arbitrum_one: arbitrum.id,
  arbitrum_goerli: arbitrumGoerli.id,
  arbitrum_sepolia: arbitrumSepolia.id,
  fantom: fantom.id,
  fantom_testnet: fantomTestnet.id,
  optimism: optimism.id,
  optimism_goerli: optimismGoerli.id,
  harmony: harmonyOne.id,
  sepolia: sepolia.id,
  scroll: scroll.id,
  scroll_sepolia: scrollSepolia.id,
  metis: metis.id,
  base: base.id,
  bnb: bsc.id,
  gnosis: gnosis.id,
  zkEVM: polygonZkEvm.id,
} as const;
