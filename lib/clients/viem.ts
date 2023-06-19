import { createPublicClient, http } from "viem";
import { goerli, mainnet } from "viem/chains";

const providerEndpoint = process.env.NEXT_PUBLIC_PROVIDER_ENDPOINT || "";
const chain = process.env.NEXT_PUBLIC_CHAIN_ID === "1" ? mainnet : goerli;

export const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

const transport = http(providerEndpoint);

export const rpcClient = createPublicClient({
  chain: goerli,
  transport,
});
