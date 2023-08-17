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
