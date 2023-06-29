"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { isNil } from "lodash";
import { getAccount, getAccountStatus, getLensNfts, getNfts } from "@/lib/utils";
import { rpcClient } from "@/lib/clients";
import { Exclamation, TbLogo } from "@/components/icon";
import { Tooltip } from "@/components/ui";
import { useGetApprovals, useNft } from "@/lib/hooks";
import { TbaOwnedNft } from "@/lib/types";
import { TokenBar } from "./TokenBar";
import { getAddress } from "viem";
import { TokenDetail } from "./TokenDetail";
import { HAS_CUSTOM_IMPLEMENTATION } from "@/lib/constants";

interface TokenParams {
  params: {
    tokenId: string;
    contractAddress: string;
  };
  searchParams: {
    apiEndpoint: string;
  };
}

export default function Token({ params, searchParams }: TokenParams) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [nfts, setNfts] = useState<TbaOwnedNft[]>([]);
  const [lensNfts, setLensNfts] = useState<TbaOwnedNft[]>([]);
  const [tokenInfoTooltip, setTokenInfoTooltip] = useState(false);
  const { tokenId, contractAddress } = params;
  const [showTokenDetail, setShowTokenDetail] = useState(false);
  const mainDisplayRef = useRef<HTMLDivElement | null>(null);
  const [mainDisplayHeight, setMainDisplayHeight] = useState(0);

  useEffect(() => {
    // Make sure the ref is assigned and the component is mounted
    if (mainDisplayRef && mainDisplayRef.current) {
      // Access and log the height of the element
      const height = mainDisplayRef.current.offsetHeight;
      setMainDisplayHeight(height);
      console.log("Element height:", height);
    }
  }, [mainDisplayRef]);
  // const { apiEndpoint } = searchParams;

  const {
    data: nftImages,
    nftMetadata,
    loading: nftMetadataLoading,
  } = useNft({
    tokenId: parseInt(tokenId as string),
    contractAddress: params.contractAddress as `0x${string}`,
    hasCustomImplementation: HAS_CUSTOM_IMPLEMENTATION,
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
  }, [nftImages]);

  // Fetch nft's TBA
  const { data: account } = useSWR(tokenId ? `/account/${tokenId}` : null, async () => {
    const result = await getAccount(Number(tokenId), contractAddress);
    return result.data;
  });

  // Get nft's TBA account bytecode to check if account is deployed or not
  const { data: accountBytecode } = useSWR(
    account ? `/account/${account}/bytecode` : null,
    async () => rpcClient.getBytecode({ address: account as `0x${string}` })
  );

  const accountIsDeployed = accountBytecode && accountBytecode?.length > 2;

  const { data: isLocked } = useSWR(account ? `/account/${account}/locked` : null, async () => {
    if (!accountIsDeployed) {
      return false;
    }

    const { data, error } = await getAccountStatus(account!);

    return data ?? false;
  });

  // fetch nfts inside TBA
  useEffect(() => {
    async function fetchNfts(account: string) {
      const [data, lensData] = await Promise.all([getNfts(account), getLensNfts(account)]);

      if (data) {
        setNfts(data);
      }
      if (lensData) {
        setLensNfts(lensData);
      }
    }

    if (account) {
      fetchNfts(account);
    }
  }, [account, accountBytecode]);

  const [tokens, setTokens] = useState<TbaOwnedNft[]>([]);

  const allNfts = [...nfts, ...lensNfts];

  const { data: approvalData } = useGetApprovals(
    allNfts.map((nft) => nft.contract.address),
    account
  );

  useEffect(() => {
    if (nfts !== undefined && nfts.length) {
      nfts.map((token) => {
        const foundApproval = approvalData?.find((item: any) => {
          const contract = item?.value?.contract;
          const tokenIds = item?.approvedTokenIds;
          const approvalForAll = item.nftApprovalForAll;

          if (getAddress(contract) === getAddress(token.contract.address) && approvalForAll) {
            return true;
          }

          if (
            getAddress(contract) === getAddress(token.contract.address) &&
            tokenIds &&
            tokenIds.includes(String(token.tokenId))
          ) {
            return true;
          }
        });

        token.hasApprovals = foundApproval?.hasApprovals || false;
      });
      setTokens(nfts);
      if (lensNfts) {
        setTokens([...nfts, ...lensNfts]);
      }
    }
  }, [nfts, approvalData, lensNfts]);

  return (
    <div className="w-screen h-screen bg-slate-100">
      <div className="relative max-h-screen mx-auto bg-white max-w-screen aspect-square overflow-hidden">
        <div className="relative w-full h-full" ref={mainDisplayRef}>
          {/* if accountDeployed is true and isLocked is false */}
          {(!isLocked || approvalData.length) && accountIsDeployed && (
            <div className="absolute top-0 right-0 z-10 w-16 h-16">
              <Tooltip
                lineOne="This token account is Unlocked or has Approvals."
                lineTwo="Its contents may be removed while listed."
                position="left"
              >
                <Exclamation />
              </Tooltip>
            </div>
          )}
          {/* <TokenBar
            account={account}
            isLocked={isLocked}
            tokenInfoTooltip={tokenInfoTooltip}
            tokens={tokens}
            setTokenInfoTooltip={setTokenInfoTooltip}
          /> */}
          {account && nftImages && nftMetadata && (
            <TokenDetail
              isOpen={showTokenDetail}
              handleOpenClose={setShowTokenDetail}
              approvalTokensCount={10}
              account={account}
              tokens={tokens}
              mainHeight={mainDisplayHeight}
              title={nftMetadata.title}
            />
          )}
          <div className="relative w-full h-full max-w-[1080px] max-h-1080[px]">
            {nftMetadataLoading ? (
              <div className="h-20 w-20 absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[45%] z-10 animate-bounce">
                <TbLogo />
              </div>
            ) : (
              <div
                className={`grid w-full grid-cols-1 grid-rows-1 transition ${
                  imagesLoaded ? "" : "blur-xl"
                }`}
              >
                {!isNil(nftImages) ? (
                  nftImages.map((image, i) => (
                    <img
                      key={i}
                      className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                      src={image}
                      alt="Nft image"
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
