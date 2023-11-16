import { getLensNfts, getNfts } from "@/lib/utils";
import { TokenboundClient } from "@tokenbound/sdk";
import { OwnedNft } from "alchemy-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";

type TBADetailsParams = {
  tokenboundClientV2: TokenboundClient;
  tokenboundClient: TokenboundClient;
  tokenId: string;
  tokenContract: `0x${string}`;
  chainId: number;
};

export const useTBADetails = ({
  tokenboundClientV2,
  tokenboundClient,
  tokenId,
  tokenContract,
  chainId,
}: TBADetailsParams) => {
  const [account, setAccount] = useState("");
  const [nfts, setNfts] = useState<OwnedNft[]>([]);

  const tbaV2 = tokenboundClientV2.getAccount({ tokenId, tokenContract });
  const tba = tokenboundClient.getAccount({ tokenId, tokenContract });

  const { data: isTbaV2Deployed } = useSWR(`tbaV2-${tokenId}-${tokenContract}`, () =>
    tokenboundClientV2.checkAccountDeployment({ accountAddress: tbaV2 })
  );

  const { data: isTbaDeployed } = useSWR(`tba-${tokenId}-${tokenContract}`, () =>
    tokenboundClient.checkAccountDeployment({ accountAddress: tba })
  );

  const { data: tbaV2NFTs } = useSWR(`tbaV2NFTs-${tokenId}-${tokenContract}`, async () => {
    const [nfts, lensNFT] = await Promise.all([getNfts(chainId, tbaV2), getLensNfts(tbaV2)]);

    return [...nfts, ...lensNFT];
  });

  const { data: tbaNFTs } = useSWR(`tbaNFTs-${tokenId}-${tokenContract}`, async () => {
    const [nfts, lensNFT] = await Promise.all([getNfts(chainId, tba), getLensNfts(tba)]);

    return [...nfts, ...lensNFT];
  });

  useEffect(() => {
    // If there are nfts in v3 by default show those
    if (tbaNFTs?.length) {
      setAccount(tba);
      setNfts(tbaNFTs);
      // If there are no nfts in v3 but there are in v2 show those
    } else if (tbaV2NFTs?.length && !tbaNFTs?.length) {
      setAccount(tbaV2);
      setNfts(tbaV2NFTs);
      // Default to v3
    } else {
      setAccount(tba);
      setNfts(tbaNFTs || []);
    }
  }, [isTbaV2Deployed, isTbaDeployed, tbaV2NFTs, tbaNFTs, tba, tbaV2]);

  return {
    account,
    nfts,
  };
};
