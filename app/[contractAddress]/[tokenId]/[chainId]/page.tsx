"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import useSWR from "swr";
import { isNil } from "lodash";
import { TokenboundClient } from "@tokenbound/sdk";
import { getAccountStatus } from "@/lib/utils";
import { TbLogo } from "@/components/icon";
import { useGetApprovals, useNft, useTBADetails } from "@/lib/hooks";
import { TbaOwnedNft } from "@/lib/types";
import { getAddress } from "viem";
import { HAS_CUSTOM_IMPLEMENTATION } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, a, config } from "@react-spring/web";
import { Panel } from "./Panel";
import { DisplayTokensButton } from "@/components/DisplayTokensButton";

// const GRADIENT = `bg-gradient-to-r from-blue-400 to-emerald-400`

interface TokenParams {
  params: {
    tokenId: string;
    contractAddress: string;
    chainId: string;
  };
  searchParams: {
    disableloading: string;
    logo?: string;
    childNetwork?: string;
    flip?: boolean;
  };
}

export default function Token({ params, searchParams }: TokenParams) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { tokenId, contractAddress, chainId } = params;
  const { disableloading, logo, childNetwork, flip } = searchParams;
  const [showTokenDetail, setShowTokenDetail] = useState(false);
  const chainIdNumber = parseInt(chainId);
  const tokenboundClient = new TokenboundClient({ chainId: chainIdNumber });

  const {
    data: nftImages,
    nftMetadata,
    loading: nftMetadataLoading,
  } = useNft({
    tokenId: parseInt(tokenId as string),
    contractAddress: params.contractAddress as `0x${string}`,
    hasCustomImplementation: HAS_CUSTOM_IMPLEMENTATION,
    chainId: chainIdNumber,
  });
  useEffect(() => {
    if (!isNil(nftImages) && nftImages.length) {
      const imagePromises = nftImages.map((src: string) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = src;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
        });
    }
  }, [nftImages, nftMetadataLoading]);

  // Fetch nft's TBA
  const { account, nfts, handleAccountChange, tba, tbaV2 } = useTBADetails({
    tokenboundClient,
    tokenId,
    tokenContract: contractAddress as `0x${string}`,
    chainId: parseInt(childNetwork ?? "11155111"),
  });

  // Get nft's TBA account bytecode to check if account is deployed or not
  const { data: accountIsDeployed } = useSWR(
    account ? `/account/${account}/bytecode` : null,
    async () => tokenboundClient.checkAccountDeployment({ accountAddress: account as `0x{string}` })
  );

  const { data: isLocked } = useSWR(account ? `/account/${account}/locked` : null, async () => {
    if (!accountIsDeployed) {
      return false;
    }

    const { data, error } = await getAccountStatus(chainIdNumber, account!);

    return data ?? false;
  });

  const [tokens, setTokens] = useState<TbaOwnedNft[]>([]);

  const { data: approvalData } = useGetApprovals(nfts, account, chainIdNumber);

  useEffect(() => {
    if (nfts !== undefined) {
      nfts.map((token) => {
        const foundApproval = approvalData?.find((item) => {
          const contract = item.contract.address;
          const tokenId = item.tokenId;
          const hasApprovals = item.hasApprovals;
          const matchedAddress = getAddress(contract) === getAddress(token.contract.address);
          const matchedTokenId = String(tokenId) && String(token.tokenId);
          if (matchedAddress && matchedTokenId && hasApprovals) {
            return true;
          }
        });
        token.hasApprovals = foundApproval?.hasApprovals || false;
      });
      setTokens(nfts);
    }
  }, [nfts, approvalData, account]);
  const showLoading = disableloading !== "true" && nftMetadataLoading;

  /**
   * @todo
   * this should ideally be hasSignedNFT
   * and should check for binder signed NFTs and
   * then display "special edition" badge
   */
  const hasChildren = Boolean(tokens.length > 0);
  const [flipped, set] = useState<boolean>(flip ?? false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: config.gentle,
  });

  if (showLoading) {
    return <Skeleton className="h-full w-full bg-slate-400" />;
  }
  return (
    <>
      {hasChildren && !flip && (
        <div
          className="absolute bottom-0 right-0 z-10 cursor-pointer rounded-full p-3"
          onClick={() => set((state) => !state)}
        >
          <DisplayTokensButton />
        </div>
      )}
      <div className={`bg-black`}>
        <a.div
          className={`
          cursor-pointer will-change-auto
        `}
          style={{ opacity: opacity.to((o) => 1 - o), transform }}
        >
          <div
            className={`group relative grid h-full w-full grid-cols-1 grid-rows-1 transition ${
              imagesLoaded ? "" : "blur-xl"
            }
            `}
          >
            {/* <div className={`absolute -inset-1.5 ${GRADIENT} blur-md opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-1000 animate-tilt`}></div> */}
            {!isNil(nftImages) ? (
              nftImages.map((image, i) => (
                <img
                  key={i}
                  className={`col-span-1 col-start-1 row-span-1 row-start-1 h-full w-full translate-x-0 bg-slate-200`}
                  src={image}
                  alt="Nft image"
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </a.div>
        <a.div
          className={`
            absolute left-0 top-0 h-full w-full will-change-auto
          `}
          style={{
            opacity,
            transform,
            rotateX: "180deg",
          }}
        >
          <div className={`h-full w-full`}>
            <Panel
              approvalTokensCount={approvalData?.filter((item) => item.hasApprovals).length}
              account={account}
              tokens={tokens}
              title={nftMetadata?.title ?? ""}
              chainId={chainIdNumber}
              accounts={[tba, tbaV2 as string]}
              handleAccountChange={handleAccountChange}
              parent={{
                contractAddress: nftMetadata?.contract.address,
                tokenId: nftMetadata?.tokenId,
              }}
              isFlipped={flipped}
            />
          </div>
        </a.div>
      </div>
    </>
  );
}
