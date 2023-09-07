import {
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
} from "viem/chains";
import { alchemyApiKey } from "./apiKeys";

export interface ChainIdToUrl {
  [key: number]: string;
}
export const chainIdToEtherscanUrl: ChainIdToUrl = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  11155111: "https://sepolia.etherscan.io",
  10: "https://optimistic.etherscan.io",
  420: "https://goerli-optimism.etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
};

export const chainIdToOpenseaAssetUrl: ChainIdToUrl = {
  1: "https://opensea.io/assets/ethereum",
  5: "https://testnets.opensea.io/assets/goerli",
  11155111: "https://testnets.opensea.io/assets/sepolia",
  10: "https://opensea.io/assets/optimism",
  420: "https://opensea.io/assets/optimism-goerli",
  137: "https://opensea.io/assets/matic",
  80001: "https://testnets.opensea.io/assets/mumbai",
};

export const chainIdToViemNetwork: { [key: number]: any } = {
  1: mainnet,
  5: goerli,
  11155111: sepolia,
  10: optimism,
  420: optimismGoerli,
  137: polygon,
  80001: polygonMumbai,
};

export const chainIdToRpcUrl: ChainIdToUrl = {
  1: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  5: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
  11155111: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  10: `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  420: `https://opt-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
  137: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  80001: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`,
};
