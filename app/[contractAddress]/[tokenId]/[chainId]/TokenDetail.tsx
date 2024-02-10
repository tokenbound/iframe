import { Variants, motion } from "framer-motion";
import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";
import { SignedLogo } from "@/components/icon/SignedLogo";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  approvalTokensCount?: number;
  account?: string;
  accounts?: string[];
  handleAccountChange: (arg0: string) => void;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  logo?: string;
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
    opacity: 0.7,
    boxShadow: "none",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

type LogoType = {
  [logo: string]: any;
};

const Logo: LogoType = {
  DEFAULT: SignedLogo,
};

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  accounts,
  handleAccountChange,
  tokens,
  title,
  chainId,
  logo,
}: Props) => {
  const CustomLogo = logo ? Logo[logo.toUpperCase()] : Logo["DEFAULT"];
  return (
    <div className={`${className} max-w-[1080px]`}>
      <Drawer shouldScaleBackground={true}>
        <div className="absolute left-4 top-4 z-10 rounded-full cursor-pointer">
          <DrawerTrigger><CustomLogo /></DrawerTrigger>
        </div>
        <DrawerContent className="w-full mx-auto">
          <Panel
            approvalTokensCount={approvalTokensCount}
            account={account}
            tokens={tokens}
            title={title}
            chainId={chainId}
            accounts={accounts}
            handleAccountChange={handleAccountChange}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
