import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";
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

export const DisplayTokensButton = () => {
  return (
    <div className="py-2 px-4 uppercase text-[0.5rem] font-bold rounded-3xl border-2 text-slate-100 flex flex-col items-center bg-yellow-800 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border-slate-200 hover:scale-105 transition duration-300">
      artist signature edition
    </div>
  );
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
  return (
    <div className={`${className} max-w-[1080px]`}>
      <Drawer shouldScaleBackground={false}>
        <div className="absolute right-0 bottom-0 z-10 rounded-full cursor-pointer p-3">
          <DrawerTrigger><DisplayTokensButton /></DrawerTrigger>
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
