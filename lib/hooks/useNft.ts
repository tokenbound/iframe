import useSWR from "swr";
import { getNftAsset } from "@/lib/utils";

export const useNft = ({
  tokenId,
  apiEndpoint,
  refreshInterval = 30000,
  cacheKey,
}: {
  tokenId: number;
  apiEndpoint?: string;
  refreshInterval?: number;
  cacheKey?: string;
}) => {
  const { data } = useSWR(
    cacheKey ?? `getNftAsset-${tokenId}`,
    () => getNftAsset(tokenId, apiEndpoint),
    {
      refreshInterval: refreshInterval,
      shouldRetryOnError: true,
      retry: 3,
    }
  );
  return {
    data: data ?? null,
  };
};
