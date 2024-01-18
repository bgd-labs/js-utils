import * as viemChains from 'viem/chains';

export enum ChainId {
  mainnet = viemChains.mainnet.id,
  ropsten = 3,
  rinkeby = 4,
  goerli = viemChains.goerli.id,
  polygon = viemChains.polygon.id,
  mumbai = viemChains.polygonMumbai.id,
  avalanche = viemChains.avalanche.id,
  fuji = viemChains.avalancheFuji.id,
  arbitrum_one = viemChains.arbitrum.id,
  arbitrum_goerli = viemChains.arbitrumGoerli.id,
  arbitrum_sepolia = viemChains.arbitrumSepolia.id,
  fantom = viemChains.fantom.id,
  fantom_testnet = viemChains.fantomTestnet.id,
  optimism = viemChains.optimism.id,
  optimism_goerli = viemChains.optimismGoerli.id,
  harmony = viemChains.harmonyOne.id,
  sepolia = viemChains.sepolia.id,
  scroll = viemChains.scroll.id,
  scroll_alpha = 534353,
  scroll_sepolia = viemChains.scrollSepolia.id,
  metis = viemChains.metis.id,
  base = viemChains.base.id,
  bnb = viemChains.bsc.id,
  gnosis = viemChains.gnosis.id,
  zkEVM = 1101,
}
