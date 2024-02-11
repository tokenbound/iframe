import { shortenAddress } from "@/lib/utils";
import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

interface CopyAddressProps {
  account: string;
  displayedAddress: string;
}


export const AddressDisplay = ({ account, displayedAddress }: CopyAddressProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg bg-[#F6F8FA] px-2 py-2 text-xs font-bold text-[#666D74] hover:cursor-pointer"
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
      <span>
        {shortenAddress(displayedAddress)}
      </span>
       <span>
        {copied ? <FaCheck /> : <BiCopy />}
      </span>
    </span>
  );
};