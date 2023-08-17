import { chainIdToEtherscanUrl } from "@/lib/constants";

interface GetEtherscanLinkParams {
  chainId?: number;
  address?: string;
}

export const getEtherscanLink = ({ chainId, address }: GetEtherscanLinkParams) => {
  if (!chainId || !address) return undefined;

  const etherscanBaseLink = chainIdToEtherscanUrl[chainId];

  if (!etherscanBaseLink) return undefined;

  const link = `${etherscanBaseLink}/address/${address}`;
  return link;
};
