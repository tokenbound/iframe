/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
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
import { Tooltip } from "@/components/ui";
import { Exclamation, TbLogo } from "@/components/icon";

type Query = {
  tokenId: string;
};

interface TbaOwnedNft extends OwnedNft {
  hasApprovals?: boolean | undefined;
  [key: string]: any;
}

interface TokenInfo {
  collection: string | undefined;
  title: string | undefined;
  approvals?: boolean | undefined;
}

export default function Token() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [blurToggle, setBlurToggle] = useState(false);
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

  const [tokenApprovalTooltip, setTokenApprovalsTooltip] = useState(false);
  const [tokenInfoTooltip, setTokenInfoTooltip] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    collection: "",
    title: "",
    approvals: false,
  });

  const router = useRouter();
  // const tokenId = router.asPath.replace("/", "");
  const { tokenId } = router.query as Query;

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

  return (
    <div className="w-screen h-screen bg-black">
      <div className="relative max-h-screen mx-auto bg-black max-w-screen aspect-square">
        {/* {isLoading ||
        (!imagesLoaded && (
          <div className="absolute w-[100vw] h-[100vh] z-50 flex items-center justify-center bg-black text-white">
            <div>Loading Sapienz Data...</div>
          </div>
        ))} */}
        {/* {data && ( */}
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

          {tokens.length && (
            <div className="absolute z-10 w-full px-4 bottom-6">
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
                    <img
                      className={`transition w-full rounded-lg opacity-100"
                          } `}
                      src={token.media[0]?.thumbnail || token.media[0]?.raw}
                      alt="image layer"
                    />
                  </div>
                ))}

                {tokens.length === 6 && (
                  <div
                    className="relative w-full h-full rounded-lg"
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
                    <img
                      className={`transition w-full rounded-lg opacity-100"
                          } `}
                      src={tokens[5].media[0]?.thumbnail || tokens[5].media[0]?.raw}
                      alt="image layer"
                    />
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
            <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-black backdrop-blur-sm"></div>
            <img
              // className={`transition w-full ${
              //   imagesLoaded ? "opacity-100" : "blur-xl opacity-0"
              // } `}
              className={`transition w-full opacity-100 opacity-0"
            } `}
              src={"/soul.gif"}
              alt="image layer"
              // onLoad={onLoad}
              // onError={onLoad}
            />
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
