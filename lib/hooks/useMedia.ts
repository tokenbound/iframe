import { useMemo } from "react";
import { Media, Nft, OwnedNft } from "alchemy-sdk";
import { decodeBase64String } from "@/lib/utils";

interface MediaArgs {
  token: Nft | OwnedNft;
  chainId: number;
}

export function useMedia({ token, chainId }: MediaArgs) {
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

  // @ts-ignore
  const canvasData = token.rawMetadata["image_canvas_data"];
  // @ts-ignore
  const parentBaseImage = token.rawMetadata["parent_base_image"];

  const mediaUrl = useMemo(() => {
    if (isVideo || isIPFSOnly) {
      return ipfsURL;
    }

    if (isBase64) {
      const base64Data = token.tokenUri?.raw ? decodeBase64String(token.tokenUri?.raw) : null;
      const base64Image = base64Data?.properties?.image?.description ?? "";

      return base64Image;
    }

    const rawImage = token.rawMetadata?.image;

    return (
      rawImage ??
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
    token.rawMetadata
  ]);


  return {
    // TODO: mimeType?
    rawMedia: media,
    mediaUrl,
    isVideo,
    canvasData,
    parentBaseImage
  };
}
