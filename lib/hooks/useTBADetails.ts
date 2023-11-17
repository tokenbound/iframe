import { getAccount, getLensNfts, getNfts } from "@/lib/utils";
import { TokenboundClient } from "@tokenbound/sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { TbaOwnedNft } from "../types";

type TBADetailsParams = {
  tokenboundClient: TokenboundClient;
  tokenId: string;
  tokenContract: `0x${string}`;
  chainId: number;
};

export const useTBADetails = ({
  tokenboundClient,
  tokenId,
  tokenContract,
  chainId,
}: TBADetailsParams) => {
  const [account, setAccount] = useState("");
  const [nfts, setNfts] = useState<TbaOwnedNft[]>([]);

  const handleAccountChange = (account: string) => {
    setAccount(account);

    if (account === tba) {
      setNfts(tbaNFTs || []);
    } else {
      setNfts(tbaV2NFTs || []);
    }
  };

  const { data: tbaV2 } = useSWR(`tbaV2-${tokenId}-${tokenContract}`, () =>
    getAccount(Number(tokenId), tokenContract, chainId)
  );

  const tba = tokenboundClient.getAccount({ tokenId, tokenContract });

  const { data: isTbaDeployed } = useSWR(`tba-${tokenId}-${tokenContract}`, () =>
    tokenboundClient.checkAccountDeployment({ accountAddress: tba })
  );

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

      return [...nfts, ...lensNFT];
    }

    return [];
  });

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
      setAccount(tbaV2?.data as `0x${string}`);
      setNfts(tbaV2NFTs);
      // Default to v3
    } else {
      setAccount(tba);
      setNfts(tbaNFTs || []);
    }
  }, [isTbaDeployed, tbaV2NFTs, tbaNFTs, tba, tbaV2?.data]);

  return {
    tba,
    tbaV2: tbaV2?.data,
    account,
    nfts,
    handleAccountChange,
  };
};
