import useSWR from "swr";
import { alchemy } from "@/lib/clients";

export function useGetTokenBalances(account: `0x${string}`) {
  return useSWR(account ? `getTokenBalance-${account}` : null, async (accountRaw) => {
    // Get token balances
    const accountAddress = accountRaw.split("-")[1];
    const balances = await alchemy.core.getTokenBalances(accountAddress);

    // Remove tokens with zero balance
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0" || token.tokenBalance !== null;
    }) as { tokenBalance: string; contractAddress: string }[];

    console.log(`Token balances of ${accountAddress} \n`);

    const tokens = [] as {
      balance: string;
      contractAddress: string;
      symbol: string | null;
      logo: string | null;
      name: string | null;
    }[];

    // Loop through all tokens with non-zero balance
    for (let token of nonZeroBalances) {
      // Get balance of token
      let balance = Number(token.tokenBalance);

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

      console.log({ metadata });

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals || 0);
      const balanceFormatted = balance.toFixed(2);

      // Print name, balance, and symbol of token
      console.log(`${metadata.name}: ${balanceFormatted} ${metadata.symbol}`);

      tokens.push({
        balance: balanceFormatted,
        contractAddress: token.contractAddress,
        symbol: metadata.symbol,
        logo: metadata.logo,
        name: metadata.name,
      });
    }

    return tokens;
  });
}
