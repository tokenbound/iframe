/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useState } from "react";
import { Check, Exclamation } from "@/components/icon";
import { Tabs, TabPanel } from "@/components/ui";
import { shortenAddress } from "@/lib/utils";
import { TbaOwnedNft } from "@/lib/types";

export const TABS = {
  COLLECTABLES: "Collectables",
  ASSETS: "Assets",
};

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
}

export const Panel = ({ className, approvalTokensCount, account, tokens, title }: Props) => {
  const [addressHovered, setAddressHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTABLES);

  const displayedAddress = addressHovered ? account : shortenAddress(account || "");

  return (
    <div
      className={clsx(
        className,
        "bg-white border-t-0 rounded-t-lg overflow-y-auto pt-5 px-5 space-y-3 h-full"
      )}
    >
      <h1 className="text-base font-bold text-black uppercase">{title}</h1>
      {account && (
        <span
          className="py-2 px-4 bg-[#F6F8FA] rounded-2xl text-xs font-bold text-[#666D74] inline-block hover:cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(account).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            });
          }}
          onMouseEnter={() => setAddressHovered(true)}
          onMouseLeave={() => setAddressHovered(false)}
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
      {approvalTokensCount && (
        <div className="bg-tb-warning-secondary flex items-start p-2 space-x-2 border-0 rounded-lg">
          <div className="h-5 w-5 min-h-[20px] min-w-[20px]">
            <Exclamation />
          </div>
          <p className="text-xs text-tb-warning-primary">
            {`There are existing approvals on (${approvalTokensCount}) tokens owned by this account. Check approval status on tokenbound.org before purchasing.`}
          </p>
        </div>
      )}
      <Tabs
        tabs={Object.values(TABS)}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />
      <TabPanel value={TABS.COLLECTABLES} currentTab={currentTab}>
        {false ? (
          // {tokens && tokens.length ? (
          <ul className="grid grid-cols-3 gap-2 overflow-y-auto">
            {tokens.map((t, i) => (
              <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none">
                <img
                  src={`${t.media[0]?.gateway}`}
                  alt="Nft image"
                  className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-sm text-gray-500 text-center">No collectables found</p>
          </div>
        )}
      </TabPanel>
      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div>I am a asset</div>
      </TabPanel>
    </div>
  );
};
