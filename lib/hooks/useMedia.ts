import { useMemo } from "react";
import { Media, Nft, OwnedNft } from "alchemy-sdk";
import { decodeBase64String } from "@/lib/utils";

interface MediaArgs {
  token: Nft | OwnedNft;
  chainId: number;
}

export function useMedia({ token, chainId }: MediaArgs) {
  const dynamicCacheKey = `${chainId}/nftMedia/${token.contract.address}/${token.tokenId}`;
  const media: Media | undefined = token.media.length > 0 ? token.media[0] : undefined;
  const isBase64: boolean =
    !media && !!token.tokenUri?.raw?.startsWith("data:application/json;base64");
  const isVideo = media?.format === "mp4";
  const isIPFSOnly: boolean = !media && !!token.tokenUri?.raw?.startsWith("ipfs://");
  const ipfsURL =
    media?.raw.replace("ipfs://", "https://ipfs.io/ipfs/") ??
    token.tokenUri?.gateway?.replace("ipfs://", "https://ipfs.io/ipfs/") ??
    token.tokenUri?.raw?.replace("ipfs://", "https://ipfs.io/ipfs/") ??
    "";

  // const { data: rawNftData } = useSWR(
  //   token ? `${dynamicCacheKey}/raw` : null,
  //   async () => {
  //     if (!isIPFSOnly) return undefined
  //     if (ipfsURL) {
  //       return await fetch(ipfsURL).then((res) => res.json())
  //     }
  //   }
  // )

  const mediaUrl = useMemo(() => {
    if (isVideo || isIPFSOnly) {
      return ipfsURL;
    }

    if (isBase64) {
      const base64Data = token.tokenUri?.raw ? decodeBase64String(token.tokenUri?.raw) : null;
      const base64Image = base64Data?.properties?.image?.description ?? "";

      return base64Image;
    }

    return (
      media?.gateway ??
      media?.thumbnail ??
      media?.raw ??
      token.tokenUri?.gateway ??
      token.tokenUri?.raw ??
      ""
    );
  }, [
    isBase64,
    ipfsURL,
    isIPFSOnly,
    isVideo,
    media?.gateway,
    media?.raw,
    token.tokenUri?.gateway,
    media?.thumbnail,
    token.tokenUri?.raw,
  ]);

  // TODO: Expose granular sizes?
  // const media ={
  //   thumbnail: mediaUrl,
  //   small: mediaUrl,
  //   small: mediaUrl,
  // }

  return {
    // TODO: mimeType?
    rawMedia: media,
    mediaUrl,
    isVideo,
  };
}
