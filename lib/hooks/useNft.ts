import useSWR from "swr";
import { getAlchemyImageSrc, getNftAsset } from "@/lib/utils";
import { fetchAlchemyNftMetadata } from "@/lib/utils/fetchAlchemyNftMetadata";

interface FormatImageReturnParams {
  imageData?: string | string[];
  loading: boolean;
}

function formatImageReturn({ imageData, loading }: FormatImageReturnParams): string[] | null {
  if (loading) return null;

  if (!imageData) {
    return ["/no-img.jpg"];
  }

  return typeof imageData === "string" ? [imageData] : imageData;
}

export const useNft = ({
  tokenId,
  apiEndpoint,
  refreshInterval = 120000,
  cacheKey,
  contractAddress,
  hasCustomImplementation,
  chainId,
}: {
  tokenId: number;
  apiEndpoint?: string;
  refreshInterval?: number;
  cacheKey?: string;
  contractAddress: `0x${string}`;
  hasCustomImplementation: boolean;
  chainId: number;
}) => {
  let key = null;
  if (hasCustomImplementation) key = cacheKey ?? `getNftAsset-${tokenId}`;

  const {
    data: customNftData,
    isLoading: customNftLoading,
    error: customNftError,
  } = useSWR(key, () => getNftAsset(tokenId, apiEndpoint), {
    refreshInterval: refreshInterval,
    shouldRetryOnError: false,
    retry: 0,
  });

  if (customNftError) console.log("CUSTOM NFT DATA FETCH ERROR: ", customNftError);

  // Bypass alchemy-sdk metadata helpers — they fail on Alchemy's current NFT API
  // response shape and cause the iframe to fall back to /no-img.jpg.
  const { data: nftMetadata, isLoading: nftMetadataLoading } = useSWR(
    `nftMetadata/${chainId}/${contractAddress}/${tokenId}`,
    () => fetchAlchemyNftMetadata(contractAddress, tokenId, chainId)
  );

  const loading = hasCustomImplementation ? customNftLoading : nftMetadataLoading;

  return {
    data:
      hasCustomImplementation && !customNftError
        ? formatImageReturn({ imageData: customNftData, loading })
        : formatImageReturn({ imageData: getAlchemyImageSrc(nftMetadata), loading }),
    nftMetadata,
    loading,
  };
};
