import { Variants, motion } from "framer-motion";
import { TokenboundLogo } from "@/components/icon";
import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";

interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
}

const variants = {
  closed: { y: "100%", transition: { duration: 0.75 } },
  open: { y: "0", transition: { duration: 0.75 }, height: "80%" },
} as Variants;

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  tokens,
  title,
  chainId,
}: Props) => {
  let currentAnimate = isOpen ? "open" : "closed";

  return (
    <div className={className}>
      <TokenboundLogo
        className="absolute left-4 top-4 z-10 opacity-[0.7] hover:opacity-[1]"
        onClick={() => handleOpenClose(!isOpen)}
      />
      {isOpen && (
        <motion.div
          className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
          animate={currentAnimate}
          variants={variants}
          initial="closed"
        >
          <Panel
            approvalTokensCount={approvalTokensCount}
            account={account}
            tokens={tokens}
            title={title}
            chainId={chainId}
          />
        </motion.div>
      )}
    </div>
  );
};
