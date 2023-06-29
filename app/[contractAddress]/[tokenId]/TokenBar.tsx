import { Exclamation, TbLogo } from "@/components/icon";
import { TbaOwnedNft, TokenInfo } from "@/lib/types";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

interface Props {
  account?: string;
  isLocked?: boolean;
  tokenInfoTooltip: boolean;
  tokens: TbaOwnedNft[];
  setTokenInfoTooltip: (arg0: boolean) => void;
}

export const TokenBar = ({
  account,
  isLocked,
  tokenInfoTooltip,
  tokens,
  setTokenInfoTooltip,
}: Props) => {
  const [addressHovered, setAddressHovered] = useState(false);
  const [tokenBarHovered, setTokenBarHovered] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    collection: "",
    title: "",
    approvals: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setTokenBarHovered(false);
    }, 3000);
  }, []);

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
  return (
    <>
      <div
        onMouseEnter={() => setTokenBarHovered(true)}
        onMouseLeave={() => setTokenBarHovered(false)}
        className="absolute z-[9] bottom-0 w-full h-6"
      ></div>
      {tokens && (
        <div
          onMouseEnter={() => setTokenBarHovered(true)}
          onMouseLeave={() => setTokenBarHovered(false)}
          className={`absolute z-10 w-full px-4 transition bottom-6 ${
            tokenBarHovered && tokens.length ? "" : "translate-y-full"
          }`}
        >
          <div className="flex items-end justify-between w-full">
            <div
              onMouseEnter={() => setTokenInfoTooltip(true)}
              onMouseLeave={() => setTokenInfoTooltip(false)}
            >
              {tokenInfoTooltip && (
                <div className="p-2 mb-2 text-sm text-white bg-black rounded-md -top-2/3 left-6">
                  <p className="font-bold">{tokenInfo.collection}</p>
                  <p className="pb-2">{tokenInfo.title}</p>
                  {tokenInfo.approvals && (
                    <p className="w-full pt-2 border-t border-white">
                      This NFT has existing Approvals and
                      <br />
                      can be transferred even if locked.
                      <br />
                      Learn more at <span className="underline">docs.sapienz.xyz</span>
                    </p>
                  )}
                </div>
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
          {!isEmpty(tokens) && (
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
                  {isLocked && (
                    <div className="absolute z-10 w-3 h-3 top-3 right-3">
                      <Exclamation />
                    </div>
                  )}
                  <div
                    className="w-full h-auto bg-center bg-no-repeat bg-contain aspect-square rounded-xl"
                    style={{
                      backgroundImage: `url(${token.media[0]?.thumbnail || token.media[0]?.raw}) `,
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
                  {isLocked && (
                    <div className="absolute z-10 w-3 h-3 top-3 right-3">
                      <Exclamation />
                    </div>
                  )}
                  <div
                    className="w-full h-auto opacity-100 aspect-square transtion"
                    style={{
                      backgroundImage: `url(${
                        tokens[5].media[0]?.thumbnail || tokens[5].media[0]?.raw
                      }) `,
                    }}
                  ></div>
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
          )}
        </div>
      )}
    </>
  );
};
