import { createPublicClient, http } from "viem";
import { goerli, mainnet } from "viem/chains";

const providerEndpoint =
  process.env.NEXT_PUBLIC_PROVIDER_ENDPOINT ||
  "https://goerli.infura.io/v3/db79b36584e44ab09511ad3a8b6e3740";

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
