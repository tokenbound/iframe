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
}

const variants = {
  closed: { y: "100%", transition: { duration: 0.75 } },
  open: { y: "0", transition: { duration: 0.75 }, height: "85%" },
} as Variants;

const iconVariant = {
  hover: {
    opacity: 1,
    boxShadow: "0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  unHovered: {
    opacity: 0.3,
    boxShadow: "none",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  tokens,
  title,
}: Props) => {
  let currentAnimate = isOpen ? "open" : "closed";

  return (
    <div className={className}>
      <motion.div
        className="absolute top-4 left-4 z-10 rounded-full"
        whileHover="hover"
        variants={iconVariant}
        initial="unHovered"
      >
        <TokenboundLogo onClick={() => handleOpenClose(!isOpen)} />
      </motion.div>
      {isOpen && (
        <motion.div
          className={`absolute max-w-[1080px] z-10 w-full bottom-0 overflow-y-auto custom-scroll`}
          animate={currentAnimate}
          variants={variants}
          initial="closed"
        >
          <Panel
            approvalTokensCount={approvalTokensCount}
            account={account}
            tokens={tokens}
            title={title}
          />
        </motion.div>
      )}
    </div>
  );
};
