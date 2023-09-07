import { createPublicClient, createWalletClient, http, custom } from "viem";
import { goerli } from "viem/chains";
import getViemNetwork from "@/lib/utils/getViemNetwork";
import { chainIdToViemNetwork } from "@/lib/constants";

const providerEndpoint = process.env.NEXT_PUBLIC_PROVIDER_ENDPOINT || "";

export const getPublicClient = (chainId: number, providerEndpoint?: string) => {
  const chain = getViemNetwork(chainId);
  const publicClient = createPublicClient({
    chain: chain,
    transport: providerEndpoint ? http(providerEndpoint) : http(),
  });
  return publicClient;
};

export const publicClient = getPublicClient(1);

const transport = http(providerEndpoint);

export const rpcClient = createPublicClient({
  chain: goerli,
  transport,
});

export const getWalletClient = (chainId: number, window: any) => {
  const walletClient = createWalletClient({
    chain: chainIdToViemNetwork[chainId],
    transport: custom(window.ethereum),
  });

  return walletClient;
};
