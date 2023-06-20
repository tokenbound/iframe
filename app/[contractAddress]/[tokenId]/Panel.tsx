import { Check, Exclamation } from "@/components/icon";
import { shortenAddress } from "@/lib/utils";
import clsx from "clsx";
import { useState } from "react";

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
}

export const Panel = ({ className, approvalTokensCount, account }: Props) => {
  const [addressHovered, setAddressHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayedAddress = addressHovered ? account : shortenAddress(account || "");

  return (
    <div
      className={clsx(
        className,
        "bg-white border-t-0 rounded-t-lg overflow-y-auto pt-5 px-5 space-y-3"
      )}
    >
      <h1 className="text-base font-bold uppercase">Token # 1</h1>
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
    </div>
  );
};
