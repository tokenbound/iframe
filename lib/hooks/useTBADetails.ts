import { getAccount, getLensNfts, getNfts } from "@/lib/utils";
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

  // const tbaV2 = tokenboundClientV2.getAccount({ tokenId, tokenContract });
  const { data: tbaV2 } = useSWR(`tbaV2-${tokenId}-${tokenContract}`, () =>
    getAccount(Number(tokenId), tokenContract, chainId)
  );

  const tba = tokenboundClient.getAccount({ tokenId, tokenContract });

  // const { data: isTbaV2Deployed } = useSWR(tbaV2 ? `tbaV2-${tokenId}-${tokenContract}` : null, () =>
  //   tokenboundClientV2.checkAccountDeployment({ accountAddress: tbaV2 })
  // );

  const { data: isTbaDeployed } = useSWR(`tba-${tokenId}-${tokenContract}`, () =>
    tokenboundClient.checkAccountDeployment({ accountAddress: tba })
  );

  // const {
  //   data: tbaV2NFTs,
  //   isLoading,
  //   error,
  // } = useSWR(`tbaV2NFTs-${tbaV2?.data}}`, () => getNfts(chainId, tbaV2?.data as `0x${string}`));
  const {
    data: tbaV2NFTs,
    isLoading,
    error,
  } = useSWR(`tbaV2NFTs-${tbaV2?.data}}`, async () => {
    if (tbaV2) {
      console.log("Inside fetching the nfts for v2: ", tbaV2);
      const [nfts, lensNFT] = await Promise.all([
        getNfts(chainId, tbaV2.data as `0x${string}`),
        getLensNfts(tbaV2.data as `0x${string}`),
      ]);

      console.log("nfts: ", nfts);

      return [...nfts, ...lensNFT];
    }

    return [];
  });

  console.log({ tbaV2NFTs });

  const { data: tbaNFTs } = useSWR(`tbaNFTs-${tba}`, async () => {
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
      setAccount(tbaV2 as `0x${string}`);
      setNfts(tbaV2NFTs);
      // Default to v3
    } else {
      setAccount(tba);
      setNfts(tbaNFTs || []);
    }
  }, [isTbaDeployed, tbaV2NFTs, tbaNFTs, tba, tbaV2]);

  return {
    account,
    nfts,
  };
};
