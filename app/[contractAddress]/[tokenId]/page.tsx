"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import useSWR from "swr";
import { isNil } from "lodash";
import { getAccount, getAccountStatus, getLensNfts, getNfts } from "@/lib/utils";
import { alchemy, rpcClient } from "@/lib/clients";
import { Exclamation, TbLogo } from "@/components/icon";
import { Tooltip } from "@/components/ui";
import { useGetApprovals } from "@/lib/hooks";
import { TbaOwnedNft } from "@/lib/types";
import { TokenBar } from "./TokenBar";
import { getAddress } from "viem";
import { TokenDetail } from "./TokenDetail";

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
  // const { apiEndpoint } = searchParams;

  // const { data: nftData } = useNft({
  //   tokenId: parseInt(tokenId as string),
  //   apiEndpoint,
  // });

  // let nftDataArray: string[] = [];
  // if (nftData && Array.isArray(nftData)) nftDataArray = nftData;
  // if (nftData && !Array.isArray(nftData)) nftDataArray = [nftData];

  // // Make sure all images are loaded before displaying it on the DOM.
  // useEffect(() => {
  //   if (nftData !== null) {
  //     const imagePromises = nftDataArray.map((src: string) => {
  //       return new Promise((resolve, reject) => {
  //         const image = new Image();
  //         image.onload = resolve;
  //         image.onerror = reject;
  //         image.src = src;
  //       });
  //     });

  //     Promise.all(imagePromises)
  //       .then(() => {
  //         setImagesLoaded(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error loading images:", error);
  //       });
  //   }
  // }, [nftData]);

  const { data: nftMetadata } = useSWR(`nft/metadata/${contractAddress}/${tokenId}`, () => {
    return alchemy.nft.getNftMetadataBatch([{ contractAddress, tokenId }]);
  });

  useEffect(() => {
    if (!isNil(nftMetadata) && nftMetadata.length) {
      const imagePromises = [nftMetadata[0]?.media[0].gateway].map((src: string) => {
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
  }, [nftMetadata]);

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
    <div className="w-screen h-screen bg-white">
      <div className="relative max-h-screen mx-auto max-w-screen aspect-square overflow-hidden">
        {/* <div className="relative max-h-screen mx-auto bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4] max-w-screen aspect-square overflow-hidden"> */}
        <div className={`relative w-full h-full`}>
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
          {account && nftMetadata && (
            <TokenDetail
              isOpen={showTokenDetail}
              handleOpenClose={setShowTokenDetail}
              approvalTokensCount={10}
              account={account}
              tokens={tokens}
            />
          )}
          <div className="relative h-full w-full">
            <div className={`grid w-full grid-cols-1 grid-rows-1 transition`}>
              {!isNil(nftMetadata) ? (
                <img
                  src={`${nftMetadata[0]?.media[0].gateway}`}
                  alt="Nft image"
                  className={`col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0 ${
                    imagesLoaded ? "" : "blur-xl"
                  } ${showTokenDetail ? "blur-xl" : ""}`}
                />
              ) : (
                // <div className="w-full h-full bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4]"></div>
                <div className="h-20 w-20 absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%] z-10">
                  <TbLogo />
                </div>
              )}
              {/* {!isNil(nftData) ? (
                nftDataArray.map((layer: string, i: number) => (
                  <img
                    key={i}
                    src={`${layer}`}
                    alt="Sapienz Token Image"
                    className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                  />
                ))
              ) : (
                // <div className="w-full h-full bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4]"></div>
                <></>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
