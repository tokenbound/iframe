/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
// import { useState } from "react";
// import { Check } from "@/components/icon";
// import { BiCopy } from "react-icons/bi";
// import { FaCheck } from "react-icons/fa6";
import {
  // Tabs,
  // TabPanel,
  MediaViewer,
  // ExternalLink,
  // DropdownMenu,
  Disclaimer,
} from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
// import useSWR from "swr";
// import { getAlchemy } from "@/lib/clients";
// import { ethers } from "ethers";
// import { useGetTokenBalances } from "@/lib/hooks";
// import { getEtherscanLink, shortenAddress } from "@/lib/utils";
import { chainIdToOpenseaAssetUrl } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Key, Terminal } from "lucide-react";
// import { Badge } from "@/components/ui/badge"
// import { AddressDisplay } from "@/components/AddressDisplay";
// import { useSpring, config, useSpringRef, useTransition, useChain, animated } from "@react-spring/web"

// export const TABS = {
//   COLLECTIBLES: "Collectibles",
//   ASSETS: "Assets",
// };

const GRADIENT = `bg-gradient-to-r from-blue-400 to-emerald-400`

interface PanelProps {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  accounts?: string[];
  handleAccountChange?: (account: string) => void;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  parent?: {
    contractAddress?: string;
    tokenId?: string;
  }
  isFlipped?:boolean;
  isLoading?:boolean;
}

export const Panel = ({
  className,
  approvalTokensCount,
  account,
  accounts,
  handleAccountChange,
  tokens,
  title,
  chainId,
  parent,
  isFlipped,
  isLoading
}: PanelProps) => {
  // const [copied, setCopied] = useState(false);
  // const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);
  // const displayedAddress = account;
  // const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
  //   const alchemy = getAlchemy(chainId);
  //   const balance = await alchemy.core.getBalance(accountAddress, "latest");
  //   return ethers.utils.formatEther(balance);
  // });
  // const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);
  // const etherscanLink = getEtherscanLink({ chainId, address: account });

  // const [open, set] = useState(false);
  // const springApi = useSpringRef();
  // const { size, ...rest } = useSpring({
  //   ref: springApi,
  //   config: config.stiff,
  //   from: { size: "20%", background: "hotpink" },
  //   to: {
  //     size: open ? "100%" : "20%",
  //     background: open ? "white" : "hotpink",
  //   },
  // });

  // const transApi = useSpringRef();
  // const transition = useTransition(open ? data : [], {
  //   ref: transApi,
  //   trail: 400 / data.length,
  //   from: { opacity: 0, scale: 0 },
  //   enter: { opacity: 1, scale: 1 },
  //   leave: { opacity: 0, scale: 0 },
  // });

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  // useChain(open ? [springApi, transApi] : [transApi, springApi], [
  //   0,
  //   // open ? 0.1 : 0.6,
  // ]);

  if (isLoading) {
    return (
      <Skeleton className="h-full w-full bg-slate-400" />
    )
  }

  return (
    <div
      className={clsx(
        className,
        "custom-scroll h-full overflow-y-auto border-0 relative bg-zinc-900",
      )}
    >

      {/* <h1 className="text-sm font-bold uppercase text-black">
        {title}
        {parent && parent.tokenId && <Badge variant="outline">{parent?.tokenId}</Badge>}
      </h1> */}

      {/* {account && displayedAddress && (
        <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription className="text-xs">
          The following assets live in your token&apos;s vault. The vault&apos;s address is{" "}<AddressDisplay account={account} displayedAddress={displayedAddress} />. These assets are owned by the token and can be controlled by whoever owns the parent token.
        </AlertDescription>
      </Alert>
      )} */}
      {approvalTokensCount ? (
        <Disclaimer
          message={`There are existing approvals on (${approvalTokensCount}) tokens owned by this account. Check approval status on tokenbound.org before purchasing.`}
        />
      ) : null}
        {tokens && tokens.length ? (
          <ul className="custom-scroll overflow-y-auto w-full h-full">
            {tokens.map((t, i) => {
              const openseaUrl = `${chainIdToOpenseaAssetUrl[chainId]}/${t.contract.address}/${t.tokenId}`;
              const is1155 = t.tokenType === "ERC1155";
              const balance = t.balance;
              return (
                <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none w-full h-full">
                  <div className="w-full h-full">
                    <MediaViewer token={t} chainId={chainId} isFlipped={isFlipped} />
                    {/* {is1155 && (
                      <div className="absolute top-4 left-4 text-white rounded-lg py-1 px-2 bg-[#000] bg-opacity-10 backdrop-blur-sm">
                        <div className="text-xl md:text-2xl font-sans font-semibold">
                          x{balance}
                        </div>
                      </div>
                    )} */}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-center text-sm text-gray-500">No collectibles found</p>
          </div>
        )}
    </div>

  );
};
