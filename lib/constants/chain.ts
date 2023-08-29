import { mainnet, polygon, polygonMumbai, goerli, sepolia, Chain, optimism } from "viem/chains";

// Configure the chains that are enabled for the front end
// We limit chain imports so we aren't imposing ALL chains on the client (we could otherwise `import *`...)
// Note: As new chains are released we may also need to update utils/chains.ts

export const IFRAME_ENABLED_CHAINS: Chain[] = [
  mainnet,
  goerli,
  sepolia,
  polygon,
  optimism,
  polygonMumbai,
];

export interface ChainIdToUrl {
  [key: number]: string;
}
export const chainIdToEtherscanUrl: ChainIdToUrl = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  10: "https://optimistic.etherscan.io",
  11155111: "https://sepolia.etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
};

export const chainIdToOpenseaAssetUrl: ChainIdToUrl = {
  1: "https://opensea.io/assets/ethereum",
  5: "https://testnets.opensea.io/assets/goerli",
  10: "https://opensea.io/assets/optimism",
  11155111: "https://testnets.opensea.io/assets/sepolia",
  137: "https://opensea.io/assets/matic",
  80001: "https://testnets.opensea.io/assets/mumbai",
};
