import { TokenboundLogo } from "@/components/icon";

interface Props {
  className?: string;
}

export const TokenDetail = ({ className }: Props) => {
  return (
    <div className={className}>
      <TokenboundLogo className="absolute top-2 left-2 z-10 opacity-[0.5] hover:opacity-[1]" />
    </div>
  );
};
