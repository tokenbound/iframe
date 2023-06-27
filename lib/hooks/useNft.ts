import { alchemy } from "@/lib/clients";
import useSWR from "swr";
import { getAlchemyImageSrc, getNftAsset } from "@/lib/utils";

function formatImageReturn(imageData?: string | string[]): string[] {
  if (!imageData) {
    return ["/no-img.jpg"];
  }

  return typeof imageData === "string" ? [imageData] : imageData;
}

interface CustomImplementation {
  contractAddress: `0x${string}`;
}

export const useNft = ({
  tokenId,
  apiEndpoint,
  refreshInterval = 30000,
  cacheKey,
  contractAddress,
  hasCustomImplementation,
}: {
  tokenId: number;
  apiEndpoint?: string;
  refreshInterval?: number;
  cacheKey?: string;
  contractAddress: `0x${string}`;
  hasCustomImplementation: boolean;
}) => {
  let key = null;
  if (hasCustomImplementation) key = cacheKey ?? `getNftAsset-${tokenId}`;

  const { data: customNftData, isLoading: customNftLoading } = useSWR(
    key,
    () => getNftAsset(tokenId, apiEndpoint),
    {
      refreshInterval: refreshInterval,
      shouldRetryOnError: true,
      retry: 3,
    }
  );

  console.log({ customNftData });

  const { data: nftMetadata, isLoading: nftMetadataLoading } = useSWR(
    !hasCustomImplementation ? `nftMetadata/${contractAddress}/${tokenId}` : null,
    (url: string) => {
      const [, contractAddress, tokenId] = url.split("/");
      return alchemy.nft.getNftMetadataBatch([{ contractAddress, tokenId }]);
    }
  );

  console.log({ nftMetadata });

  return {
    data: hasCustomImplementation
      ? formatImageReturn(customNftData)
      : formatImageReturn(getAlchemyImageSrc(nftMetadata?.[0])),
    loading: hasCustomImplementation ? customNftLoading : nftMetadataLoading,
  };
};
