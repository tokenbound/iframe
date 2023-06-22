import { useEffect, useState } from "react";
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
  mainHeight: number;
  title: string;
}

const variants = {
  open: { y: "50%", transition: { duration: 0.75 } },
  closed: { y: "120%", transition: { duration: 0.75 } },
  scroll: { y: "30%", transition: { duration: 0.75 } },
} as Variants;

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  tokens,
  mainHeight,
  title,
}: Props) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasScrolled(false);
    }
  }, [isOpen]);

  let currentAnimate = "closed";
  if (isOpen) currentAnimate = "open";
  if (isOpen && hasScrolled) currentAnimate = "scroll";

  const handleScroll = () => {
    if (isOpen && !hasScrolled) setHasScrolled(true);
  };

  const maxPanelHeight = mainHeight * 0.9;
  const height = `h-[${maxPanelHeight}px]`;

  console.log({ maxPanelHeight, mainHeight, height });

  return (
    <div className={className}>
      <TokenboundLogo
        className="absolute top-4 left-4 z-10 opacity-[0.7] hover:opacity-[1]"
        onClick={() => handleOpenClose(!isOpen)}
      />
      {isOpen && (
        <motion.div
          className={`max-w-[1080px] z-10 absolute w-full ${height} bottom-0 overflow-y-auto`}
          animate={currentAnimate}
          variants={variants}
          onScroll={handleScroll}
          onClick={handleScroll}
          initial={{ y: "120%" }}
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
