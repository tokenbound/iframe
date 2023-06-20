import { useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import { TokenboundLogo } from "@/components/icon";
import { Panel } from "./Panel";

/**
 * Goal 1: on click show an box, it should slide up and blue the current background
 * Goal 2: on clicking this it, shows more of the assets or scroll let's say
 * Goal 3: Add in nfts and assets
 *
 * add a state for showing and hiding
 * add a component for the slider
 */

interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  approvalTokensCount?: number;
  account?: string;
}

const variants = {
  open: { y: "50%", transition: { duration: 1 } },
  closed: { y: "200%", transition: { duration: 1 } },
} as Variants;

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
}: Props) => {
  return (
    <div className={className}>
      <TokenboundLogo
        className="absolute top-4 left-4 z-10 opacity-[0.7] hover:opacity-[1]"
        onClick={() => handleOpenClose(!isOpen)}
      />
      {/* {showPanel && ( */}
      <motion.div
        className="z-10 absolute h-full w-full"
        // initial={{ y: -100 }}

        animate={isOpen ? "open" : "closed"}
        variants={variants}
      >
        <Panel approvalTokensCount={approvalTokensCount} account={account} />
      </motion.div>
      {/* )} */}
    </div>
  );
};
