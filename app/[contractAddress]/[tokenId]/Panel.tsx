/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useState } from "react";
import { Check, Exclamation } from "@/components/icon";
import { Tabs, TabPanel, MediaViewer } from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { alchemy } from "@/lib/clients";
import { ethers } from "ethers";
import { useGetTokenBalances } from "@/lib/hooks";

export const TABS = {
  COLLECTIBLES: "Collectibles",
  ASSETS: "Assets",
};

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
}

const CHAIN_ID = 1;

export const Panel = ({ className, approvalTokensCount, account, tokens, title }: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);
  const displayedAddress = account;

  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, CHAIN_ID);

  return (
    <div
      className={clsx(
        className,
        "bg-white border-t-0 rounded-t-xl overflow-y-auto pt-5 px-5 space-y-3 h-full custom-scroll"
      )}
    >
      <div className="w-full flex items-center justify-center mb-4">
        <div className="bg-[#E4E4E4] h-[2.5px] w-[34px]"></div>
      </div>
      <h1 className="text-base font-bold text-black uppercase">{title}</h1>
      {account && (
        <span
          className="py-2 px-4 bg-[#F6F8FA] rounded-2xl text-xs font-bold text-[#666D74] inline-block hover:cursor-pointer"
          onClick={() => {
            const textarea = document.createElement("textarea");
            textarea.textContent = account;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();

            try {
              document.execCommand("copy"); // Security exception may be thrown by some browsers.
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);

              return;
            } catch (ex) {
              console.warn("Copy to clipboard failed.", ex);
              return false;
            } finally {
              document.body.removeChild(textarea);
            }
          }}
        >
          {copied ? (
            <span>
              <Check />
            </span>
          ) : (
            displayedAddress
          )}
        </span>
      )}
      {approvalTokensCount ? (
        <div className="bg-tb-warning-secondary flex items-start p-2 space-x-2 border-0 rounded-lg">
          <div className="h-5 w-5 min-h-[20px] min-w-[20px]">
            <Exclamation />
          </div>
          <p className="text-xs text-tb-warning-primary">
            {`There are existing approvals on (${approvalTokensCount}) tokens owned by this account. Check approval status on tokenbound.org before purchasing.`}
          </p>
        </div>
      ) : null}
      <Tabs
        tabs={Object.values(TABS)}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />
      <TabPanel value={TABS.COLLECTIBLES} currentTab={currentTab}>
        {tokens && tokens.length ? (
          <ul className="grid grid-cols-3 gap-2 overflow-y-auto custom-scroll">
            {tokens.map((t, i) => {
              let media = t?.media[0]?.gateway || t?.media[0]?.raw;
              const isVideo = t?.media[0]?.format === "mp4";
              if (isVideo) {
                media = t?.media[0]?.raw;
              }

              return (
                <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none">
                  <MediaViewer url={media} isVideo={isVideo} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-sm text-gray-500 text-center">No collectibles found</p>
          </div>
        )}
      </TabPanel>
      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div className="space-y-3 flex flex-col w-full">
          <div className="flex justify-between items-center w-full ">
            <div className="flex items-center space-x-4">
              <img src="/ethereum-logo.png" alt="ethereum logo" className="h-[30px] w-[30px]" />
              <div className="text-base text-black font-medium">Ethereum</div>
            </div>
            <div className="text-base text-[#979797]">
              {ethBalance ? Number(ethBalance).toFixed(2) : "0.00"}
            </div>
          </div>
          {tokenBalanceData?.map((tokenData, i) => (
            <div className="flex items-center justify-between" key={i}>
              <div className="flex items-center space-x-4">
                {tokenData.logo ? (
                  <img src={tokenData.logo} alt="coin logo" className="h-[30px] w-[30px]" />
                ) : (
                  <div className="text-3xl">💰</div>
                )}
                <div className="text-base text-black font-medium">{tokenData.name || ""}</div>
              </div>
              <div className="text-base text-[#979797]">{tokenData.balance}</div>
            </div>
          ))}
        </div>
      </TabPanel>
    </div>
  );
};
