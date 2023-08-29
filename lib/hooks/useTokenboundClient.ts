"use client";
import { TokenboundClient } from "@tokenbound/sdk";
import { useEffect, useMemo, useState } from "react";
import { useWalletClient } from "wagmi";

interface TBClientParams {
  chainId?: number;
}

export function useTokenboundClient({ chainId = 1 }: TBClientParams) {
  const [tbClient, setTbClient] = useState<TokenboundClient>();
  const { data: walletClient, isLoading } = useWalletClient({ chainId });

  const tokenboundClient = useMemo(() => {
    if (!chainId) return null;

    // @ts-ignore TODO: figure out why walletClient is not being recognized as a WalletClient
    return new TokenboundClient({ walletClient: walletClient ?? undefined, chainId: chainId });
  }, [chainId, walletClient]);

  useEffect(() => {
    if (tokenboundClient) {
      setTbClient(tokenboundClient);
    }
  }, [tokenboundClient]);

  return {
    tokenboundClient: tbClient,
    isTokenboundClientLoading: isLoading,
  };
}
