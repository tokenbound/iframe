import * as Sentry from "@sentry/nextjs";
import { publicClient } from "@/lib/clients/viem";
import { implementationAbi, tokenboundAbi } from "@/lib/abi";
import { chainId, implementationAddress, salt, tokenboundAddress } from "@/lib/constants";

interface GetAccountStatus {
  data?: boolean;
  error?: string;
}

export async function getAccountStatus(account: string): Promise<GetAccountStatus> {
  try {
    const response = (await publicClient.readContract({
      address: account as `0x${string}`,
      abi: implementationAbi,
      functionName: "isLocked",
    })) as boolean;

    return { data: response };
  } catch (error) {
    console.error(error);
    Sentry.captureMessage(`getAccountStatus error`, {
      tags: {
        reason: "isLocked",
      },
      extra: {
        prepareError: error,
        account,
      },
    });

    return {
      error: `failed getting account status for account: ${account}. It may not exist yet.`,
    };
  }
}

interface GetAccount {
  data?: string;
  error?: string;
}

export async function getAccount(tokenId: number, contractAddress: string): Promise<GetAccount> {
  try {
    const response = (await publicClient.readContract({
      address: tokenboundAddress as `0x${string}`,
      abi: tokenboundAbi,
      functionName: "account",
      args: [implementationAddress, chainId, contractAddress, tokenId, salt],
    })) as string;

    return { data: response };
  } catch (err) {
    console.error(err);
    Sentry.captureMessage(`getAccount error`, {
      tags: {
        reason: "account",
      },
      extra: {
        prepareError: err,
        tokenId,
      },
    });

    return { error: `failed getting account for token $id: {tokenId}` };
  }
}
