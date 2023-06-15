import useSWR from "swr";
import { getNftAsset } from "@/lib/utils";

export const useNft = ({
  tokenId,
  refreshInterval = 30000,
  cacheKey,
}: {
  tokenId: number;
  refreshInterval?: number;
  cacheKey?: string;
}) => {
  const { data } = useSWR(cacheKey ?? `getNftAsset-${tokenId}`, () => getNftAsset(tokenId), {
    refreshInterval: refreshInterval,
    shouldRetryOnError: true,
    retry: 3,
  });
  return {
    data: data ?? null,
  };
};
