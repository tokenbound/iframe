/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useState } from "react";
import { Check, Exclamation } from "@/components/icon";
import { Tabs, TabPanel, MediaViewer } from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { getAlchemy } from "@/lib/clients";
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
  chainId: number;
}

export const Panel = ({
  className,
  approvalTokensCount,
  account,
  tokens,
  title,
  chainId,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);

  const displayedAddress = account;

  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);

  return (
    <div
      className={clsx(
        className,
        "custom-scroll h-full space-y-3 overflow-y-auto rounded-t-xl border-t-0 bg-white px-5 pt-5"
      )}
    >
      <div className="mb-4 flex w-full items-center justify-center">
        <div className="h-[2.5px] w-[34px] bg-[#E4E4E4]"></div>
      </div>
      <h1 className="text-base font-bold uppercase text-black">{title}</h1>
      {account && (
        <span
          className="inline-block rounded-2xl bg-[#F6F8FA] px-4 py-2 text-xs font-bold text-[#666D74] hover:cursor-pointer"
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
        <div className="flex items-start space-x-2 rounded-lg border-0 bg-tb-warning-secondary p-2">
          <div className="h-5 min-h-[20px] w-5 min-w-[20px]">
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
          <ul className="custom-scroll grid grid-cols-3 gap-2 overflow-y-auto">
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
            <p className="text-center text-sm text-gray-500">No collectables found</p>
          </div>
        )}
      </TabPanel>
      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div className="flex w-full flex-col space-y-3">
          <div className="flex w-full items-center justify-between ">
            <div className="flex items-center space-x-4">
              <img src="/ethereum-logo.png" alt="ethereum logo" className="h-[30px] w-[30px]" />
              <div className="text-base font-medium text-black">Ethereum</div>
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
                <div className="text-base font-medium text-black">{tokenData.name || ""}</div>
              </div>
              <div className="text-base text-[#979797]">{tokenData.balance}</div>
            </div>
          ))}
        </div>
      </TabPanel>
    </div>
  );
};
