import { useEffect, useState } from "react";
import getBinderRevealedMetadata, { BinderRevealedMetadata } from "../utils/getBinderRevealedMetadata";
import useSWR from "swr";
import { getAlchemy } from "../clients";

/**
 *
 * The hook will fetch from alchemy (returns type Nft)
 * then fetches directly from the contract
 * if fetch from the contract results in metadata with isTBA = true
 * it returns the metadata fetched from the contract
 * if not, returns the metadata fetched from alchemy
 *
 */
export const useNft = ({
  tokenId,
  contractAddress,
  chainId,
}: {
  tokenId?: number;
  contractAddress?: `0x${string}`;
  chainId?: number;
}) => {
  const [nftMetadata, setNftMetadata] = useState<BinderRevealedMetadata>();
  const [nftImage, setNftImage] = useState<string>();
  const [canvasData, setCanvasData] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isTBA, setIsTBA] = useState<boolean>(false);
  const [parent, setParent] = useState<BinderRevealedMetadata["parent"]>();

  const { data: firstFetchNftMetadata, isLoading: nftMetadataLoading } = useSWR(
    `nftMetadata/${contractAddress}/${tokenId}`,
    (url: string) => {
      const [, contractAddress, tokenId] = url.split("/");
      const alchemy = getAlchemy(chainId ?? 1);
      return alchemy.nft.getNftMetadataBatch([{ contractAddress, tokenId }]);
    }
  );

  const getMetadata = async () => {
    if (!contractAddress || !chainId || !tokenId) return;
    setLoading(true);
    const nftMetadata = await getBinderRevealedMetadata(contractAddress, tokenId, chainId);
    if (nftMetadata.isTBA && nftMetadata.parent) {
      setNftMetadata(nftMetadata);
      setNftImage(nftMetadata.image);
      if (nftMetadata.image_canvas_data) {
        setCanvasData(nftMetadata.image_canvas_data);
      }
      setIsTBA(true);
      setParent(nftMetadata.parent)
      setLoading(false);
      return;
    }
  }
  useEffect(() => {
    getMetadata();
  }, [tokenId, contractAddress, chainId])

  return {
    data: [nftImage],
    nftMetadata: nftMetadata || firstFetchNftMetadata?.[0],
    loading,
    parent,
    isTBA,
    canvasData
  };
};
