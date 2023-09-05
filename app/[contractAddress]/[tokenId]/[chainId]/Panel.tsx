/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Check, Exclamation, GalverseLogo } from "@/components/icon";
import { Tabs, TabPanel, MediaViewer, ExternalLink } from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { getAlchemy } from "@/lib/clients";
import { ethers } from "ethers";
import { useGetTokenBalances } from "@/lib/hooks";
import { getEtherscanLink, shortenAddress } from "@/lib/utils";
import { chainIdToOpenseaAssetUrl } from "@/lib/constants";
import Image from "next/image";

import galverseLogo from "@/public/no-img.jpg";

export const TABS = {
  COLLECTIBLES: "Collectibles",
  ASSETS: "Assets",
  UPGRADES: "Upgrades",
};

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  tokenId: string;
}

export const Panel = ({
  className,
  approvalTokensCount,
  account,
  tokens,
  title,
  chainId,
  tokenId,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);
  const [upgradeState, setUpgradeState] = useState(0);

  const displayedAddress = account;

  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);
  const etherscanLink = getEtherscanLink({ chainId, address: account });

  useEffect(() => {
    async function fetchMetadata() {
      const res = await fetch(`https://www.galverse.art/api/metadata/${tokenId}.json`);
      const data = await res.json();

      data.attributes.map((attr: { trait_type: string; value: string }) => {
        if (attr.trait_type === "6551 Upgrade" && attr.value === "Enabled")
          setUpgradeState((prev) => prev + 1);
        if (attr.trait_type === "VTuber Upgrade" && attr.value === "Enabled")
          setUpgradeState((prev) => prev + 1);
      });
      // console.log(upgradeState);
      console.log(data.attributes);
    }

    if (tokenId) {
      fetchMetadata();
    }
  }, [tokenId]);

  return (
    <div
      className={clsx(
        className,
        "custom-scroll relative h-full space-y-3 overflow-y-auto rounded-t-[40px] max-[440px]:rounded-t-[32px] border-t-0 bg-black-bg text-white px-6 pt-6 max-[440px]:px-5 max-[440px]:pt-6 max-[385px]:px-4 max-[385px]:pt-4 bg-[url('/bg-circle.svg'),url('/gridpattern.svg')] bg-cover"
      )}
    >
      <div className=" mb-6 h-[5px] w-[50px] rounded-full bg-white/80 mx-auto" />

      <h1 className="text-lg max-[440px]:text-base max-[385px]:text-sm uppercase text-gray-text/80 font-semibold">
        {title}
      </h1>

      <div className="flex items-center justify-between !-mt-1 !mb-4">
        <div className="flex ">
          <Image
            src="/galverse-logo-white.svg"
            alt="logo"
            width={36}
            height={36}
            className="max-[385px]:h-[25px] max-[385px]:w[325x] max-[440px]:h-[30px] max-[440px]:w[30px]"
          />
          <h2 className="text-[clamp(1.3rem,-1rem+10vw,3rem)] leading-[1] uppercase font-bold ml-2 max-[385px]:ml-0.5 max-[440px]:ml-1">
            Inventory
          </h2>
        </div>

        {account && displayedAddress && (
          <div className="flex items-center justify-start space-x-2">
            <span
              className="inline-block rounded-full bg-[#202020] hover:bg-[#2B2B2B] px-5 py-2 max-[440px]:px-[16px] max-[385px]:px-[12px] max-[440px]:py-[6px] max-[385px]:py-[3px] font-secondary text-base max-[440px]:text-[14px] max-[385px]:text-[12px] font-bold uppercase text-gray-text/80 hover:text-gray-text hover:cursor-pointer transition-all duration-200"
              onClick={() => {
                const textarea = document.createElement("textarea");
                textarea.textContent = account;
                textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
                document.body.appendChild(textarea);
                textarea.select();

                try {
                  document.execCommand("copy"); // Security exception may be thrown by some browsers.
                  setCopied(true);
                  return;
                } catch (ex) {
                  console.warn("Copy to clipboard failed.", ex);
                  return false;
                } finally {
                  document.body.removeChild(textarea);
                }
              }}
            >
              {copied ? <span>Copied!</span> : shortenAddress(displayedAddress)}
            </span>
            <ExternalLink
              className="text-gray-text/80 flex items-center justify-center rounded-full h-[40px] w-[40px] max-[440px]:h-[36px] max-[440px]:w-[36px] max-[385px]:h-[28px] max-[385px]:w-[28px] p-2 max-[440px]:p-[7px] max-[385px]:p-1.5 bg-[#202020] hover:bg-[#2B2B2B] hover:text-gray-text transition-all duration-200"
              link={etherscanLink}
            />
          </div>
        )}
      </div>

      {/* Double Border Dots */}
      <Image
        src="/double-border-dot.svg"
        alt="logo"
        width={1000}
        height={40}
        className="!w-full !my-3"
      />

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
          <ul className="custom-scroll grid grid-cols-3 gap-4 max-[440px]:gap-3 max-[385px]:gap-[10px] overflow-visible">
            {tokens.map((t, i) => {
              let media = t?.media[0]?.gateway || t?.media[0]?.raw;
              const isVideo = t?.media[0]?.format === "mp4";
              if (isVideo) {
                media = t?.media[0]?.raw;
              }

              const openseaUrl = `${chainIdToOpenseaAssetUrl[chainId]}/${t.contract.address}/${t.tokenId}`;

              return (
                <li
                  key={`${t.contract.address}-${t.tokenId}-${i}`}
                  className="list-none transition-all duration-200 rounded-xl overflow-hidden hover:scale-[1.03] hover:shadow-[0px_6px_12px_0px_rgba(0,0,0,0.23),0px_23px_23px_0px_rgba(0,0,0,0.20),0px_51px_31px_0px_rgba(0,0,0,0.12),_0px_90px_36px_0px_rgba(0,0,0,0.03),0px_141px_40px_0px_rgba(0,0,0,0.00)]"
                >
                  <a href={openseaUrl} target="_blank" className="cursor-pointer">
                    <MediaViewer url={media} isVideo={isVideo} />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-center text-sm text-gray-text">This Gal's inventory is empty</p>
          </div>
        )}
      </TabPanel>

      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-[100%+24px] max-[440px]:w-[100%+20px] max-[385px]:w-[100%+16px] items-center justify-between py-4 px-6 bg-gray-300 bg-opacity-[0.02] -mx-6 max-[440px]:-mx-5 max-[385px]:-mx-4">
            <div className="flex items-center space-x-4">
              <img
                src="/ethereum-logo.png"
                alt="ethereum logo"
                className="h-[28px] w-[28px] max-[440px]:h-[28px] max-[440px]:w-[28px]"
              />
              <div className="text-xl max-[440px]:text-lg font-medium text-white">Ethereum</div>
            </div>
            <div className="text-xl max-[440px]:text-lg font-medium text-white">
              {ethBalance ? Number(ethBalance).toFixed(2) : "0.00"}
            </div>
          </div>
          {tokenBalanceData?.map((tokenData, i) => (
            <div
              className="flex w-[100%+24px] max-[440px]:w-[100%+20px] max-[385px]:w-[100%+16px] items-center justify-between py-4 px-6 bg-gray-300 bg-opacity-[0.02] -mx-6 max-[440px]:-mx-5 max-[385px]:-mx-4"
              key={i}
            >
              <div className="flex items-center space-x-4">
                {tokenData.logo ? (
                  <img
                    src={tokenData.logo}
                    alt="coin logo"
                    className="h-[28px] w-[28px] max-[440px]:h-[28px] max-[440px]:w-[28px]"
                  />
                ) : (
                  <div className="text-3xl">💰</div>
                )}
                <div className="text-xl max-[440px]:text-lg font-medium text-white">
                  {tokenData.name || ""}
                </div>
              </div>
              <div className="text-xl max-[440px]:text-lg font-medium text-white">
                {tokenData.balance}
              </div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value={TABS.UPGRADES} currentTab={currentTab}>
        <div className="flex justify-center items-center pt-[16%] max-[440px]:pt-[2%] max-[600px]:pt-[8%]">
          <Image
            src={
              upgradeState == 1
                ? "/1-upgrade.png"
                : upgradeState == 2
                ? "/2-upgrade.png"
                : "/empty.png"
            }
            width={800}
            height={200}
            alt="upgrade state"
            className="w-9/12"
          />
        </div>
      </TabPanel>
    </div>
  );
};
