"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { OwnedNft, NftContract } from "alchemy-sdk";
import useSWR from "swr";
import {
  getAccount,
  getAccountStatus,
  getLensNfts,
  getNfts,
  handleNftApprovals,
} from "@/lib/utils";
import { rpcClient } from "@/lib/clients";
import { Exclamation, TbLogo } from "@/components/icon";
import { Tooltip } from "@/components/ui";
import { useNft } from "@/lib/hooks";

interface TbaOwnedNft extends OwnedNft {
  hasApprovals?: boolean | undefined;
  [key: string]: any;
}

interface TokenInfo {
  collection: string | undefined;
  title: string | undefined;
  approvals?: boolean | undefined;
}

export default function Token({ params }: { params: { id: string } }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  // incase this setting isLocked fails we set null to maybe show a diff state.
  const [nfts, setNfts] = useState<TbaOwnedNft[]>([]);
  const [lensNfts, setLensNfts] = useState<TbaOwnedNft[]>([]);
  const [nftApprovalStatus, setNftApprovalStatus] = useState<
    {
      contract: string | NftContract;
      hasApprovals?: boolean;
      tokenId: string;
    }[]
  >();

  const [tokenInfoTooltip, setTokenInfoTooltip] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    collection: "",
    title: "",
    approvals: false,
  });

  const tokenId = params.id;

  const { data: nftData } = useNft({
    tokenId: parseInt(tokenId as string),
  });

  let nftDataArray: string[] = [];
  if (nftData && Array.isArray(nftData)) nftDataArray = nftData;
  if (nftData && !Array.isArray(nftData)) nftDataArray = [nftData];

  useEffect(() => {
    if (nftData !== null) {
      const imagePromises = nftDataArray.map((src: string) => {
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
  }, [nftData]);

  const { data: account } = useSWR(tokenId ? `/account/${tokenId}` : null, async () => {
    const result = await getAccount(Number(tokenId));
    return result.data;
  });

  const { data: accountBytecode } = useSWR(
    account ? `/account/${account}/bytecode` : null,
    async () => rpcClient.getBytecode({ address: account as `0x${string}` })
  );

  const { data: isLocked } = useSWR(account ? `/account/${account}/locked` : null, async () => {
    if (!accountBytecode || accountBytecode?.length <= 2) {
      return false;
    }

    const { data, error } = await getAccountStatus(account!);

    return data ?? false;
  });

  useEffect(() => {
    async function fetchNfts(account: string) {
      const data = await getNfts(account);
      const lensData = await getLensNfts(account);

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

  useEffect(() => {
    async function getApprovals(nfts: TbaOwnedNft[], account: string) {
      if (!accountBytecode || accountBytecode?.length <= 2) {
        return;
      }

      const approvals = await handleNftApprovals(nfts, account);

      if (approvals) {
        setNftApprovalStatus(approvals);
      }
    }

    if (nfts.length && account) {
      getApprovals(nfts, account);
    }
  }, [nfts, account, accountBytecode]);

  const [tokens, setTokens] = useState<TbaOwnedNft[]>([]);

  useEffect(() => {
    if (nfts !== undefined && nfts.length) {
      nfts.map((token) => {
        const foundApproval = nftApprovalStatus?.find(
          (item) => item.contract === token.contract.address && item.tokenId === token.tokenId
        );

        token.hasApprovals = foundApproval?.hasApprovals || false;
      });
      setTokens(nfts);
      if (lensNfts) {
        setTokens([...nfts, ...lensNfts]);
      }
    }
  }, [nfts, nftApprovalStatus]);

  const handleTokenInfoTooltip = (
    collection: string | undefined,
    title: string,
    approvals: boolean | undefined
  ) => {
    setTokenInfo({
      collection: collection,
      title: title,
      approvals: approvals,
    });
    setTokenInfoTooltip(true);
  };

  const [addressHovered, setAddressHovered] = useState(false);
  const [tokenBarHovered, setTokenBarHovered] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTokenBarHovered(false);
    }, 3000);
  }, []);

  console.log({ nftData });

  return (
    <div className="w-screen h-screen bg-white">
      <div className="relative max-h-screen mx-auto bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4] max-w-screen aspect-square overflow-hidden">
        <div className="relative w-full h-full">
          {isLocked ? (
            <div className="absolute top-0 right-0 z-10 w-16 h-16">
              <Tooltip
                lineOne="This token account is Unlocked or has Approvals."
                lineTwo="Its contents may be removed while listed."
                position="left"
              >
                <Exclamation />
              </Tooltip>
            </div>
          ) : (
            <></>
          )}
          <div
            onMouseEnter={() => setTokenBarHovered(true)}
            onMouseLeave={() => setTokenBarHovered(false)}
            className="absolute z-[9] bottom-0 w-full h-6"
          ></div>
          {tokens.length && (
            <div
              onMouseEnter={() => setTokenBarHovered(true)}
              onMouseLeave={() => setTokenBarHovered(false)}
              className={`absolute z-10 w-full px-4 transition bottom-6 ${
                tokenBarHovered ? "" : "translate-y-full"
              }`}
            >
              <div className="flex items-end justify-between w-full">
                <div
                  onMouseEnter={() => setTokenInfoTooltip(true)}
                  onMouseLeave={() => setTokenInfoTooltip(false)}
                >
                  {tokenInfoTooltip ? (
                    <div className="p-2 mb-2 text-sm text-white bg-black rounded-md -top-2/3 left-6">
                      <p className="font-bold">{tokenInfo.collection}</p>
                      <p className="pb-2">{tokenInfo.title}</p>
                      {tokenInfo.approvals ? (
                        <p className="w-full pt-2 border-t border-white">
                          This NFT has existing Approvals and
                          <br />
                          can be transferred even if locked.
                          <br />
                          Learn more at <span className="underline">docs.sapienz.xyz</span>
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  className={`relative flex items-center px-2 py-1 space-x-2 duration-1000 rounded-t-lg cursor-pointer transition-width h-fit bg-white/60 ${
                    addressHovered ? "w-fit" : "w-fit"
                  }`}
                  onMouseEnter={() => setAddressHovered(true)}
                  onMouseLeave={() => setAddressHovered(false)}
                >
                  <div className="w-4 h-4">
                    <TbLogo />
                  </div>
                  <p className="text-xs font-bold md:text-base">
                    {addressHovered ? (
                      <>{account}</>
                    ) : (
                      <>
                        {account?.slice(0, 5)}...{account?.slice(-4)}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="grid w-full grid-cols-6 p-3 rounded-lg rounded-tr-none gap-x-3 bg-white/60">
                {[...tokens].slice(0, 5).map((token: TbaOwnedNft, i: number) => (
                  <div
                    key={i}
                    className="relative w-full h-full rounded-lg"
                    onMouseEnter={() =>
                      handleTokenInfoTooltip(token.contract.name, token.title, token.hasApprovals)
                    }
                    onMouseLeave={() => setTokenInfoTooltip(false)}
                  >
                    {isLocked ? (
                      <div className="absolute z-10 w-3 h-3 top-3 right-3">
                        <Exclamation />
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className="w-full h-auto bg-center bg-no-repeat bg-contain aspect-square rounded-xl"
                      style={{
                        backgroundImage: `url(${
                          token.media[0]?.thumbnail || token.media[0]?.raw
                        }) `,
                      }}
                    ></div>
                  </div>
                ))}

                {tokens.length === 6 && (
                  <div
                    className="relative w-full h-auto rounded-lg"
                    onMouseEnter={() =>
                      handleTokenInfoTooltip(
                        tokens[5].contract.name,
                        tokens[5].title,
                        tokens[5].hasApprovals
                      )
                    }
                    onMouseLeave={() => setTokenInfoTooltip(false)}
                  >
                    {isLocked ? (
                      <div className="absolute z-10 w-3 h-3 top-3 right-3">
                        <Exclamation />
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className="w-full h-auto opacity-100 aspect-square transtion"
                      style={{
                        backgroundImage: `url(${
                          tokens[5].media[0]?.thumbnail || tokens[5].media[0]?.raw
                        }) `,
                      }}
                    ></div>
                    {/* <img
                      className={`transition w-full rounded-lg opacity-100"
                          } `}
                      src={
                        tokens[5].media[0]?.thumbnail || tokens[5].media[0]?.raw
                      }
                      alt="image layer"
                    /> */}
                  </div>
                )}
                {tokens.length < 6 &&
                  Array.from({ length: 6 - tokens.length }).map((_, i) => (
                    <div key={i} className="w-full h-full rounded-lg">
                      <div className="w-full h-full border-[2px] border-white border-dashed bg-white/50 rounded-lg"></div>
                    </div>
                  ))}
                {tokens.length > 6 && (
                  <div className="w-full h-full rounded-lg">
                    <div className="flex items-center justify-center w-full h-full rounded-lg bg-black/20">
                      <span className="text-lg font-bold text-white">+{tokens.length - 5}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="relative w-full">
            <div
              className={`grid w-full grid-cols-1 grid-rows-1 transition ${
                imagesLoaded ? "" : "blur-xl"
              }`}
            >
              {nftData ? (
                nftDataArray.map((layer: string, i: number) => (
                  <img
                    key={i}
                    src={`${layer}`}
                    alt="Sapienz Token Image"
                    className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                  />
                ))
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#ab96d3] via-[#fbaaac] to-[#ffe8c4]"></div>
              )}
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
