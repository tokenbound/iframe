import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useSpring, a } from "@react-spring/web"
import { useState } from 'react';
import { DisplayTokensButton } from "@/components/DisplayTokensButton";

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
  const [flipped, set] = useState(false)

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  return (
    <div className={`${className} max-w-[1080px]`}>
        <div className="absolute right-0 bottom-0 z-10 rounded-full cursor-pointer p-3" onClick={() => set(state => !state)}>
          <DisplayTokensButton />
        </div>
        {/* <Panel
          approvalTokensCount={approvalTokensCount}
          account={account}
          tokens={tokens}
          title={title}
          chainId={chainId}
          accounts={accounts}
          handleAccountChange={handleAccountChange}
        /> */}
        <a.div
          className={`
           absolute w-[500px] h-[500px] cursor-pointer will-change-auto bg-blue-300
          `}
          style={{ opacity: opacity.to(o => 1 - o), transform }}
        ></a.div>
        <a.div
          className={`
          absolute w-[500px] h-[500px] cursor-pointer will-change-auto bg-red-500
          `}
          style={{
            opacity,
            transform,
            rotateX: '180deg',
          }}
        />
    </div>
  );
};
