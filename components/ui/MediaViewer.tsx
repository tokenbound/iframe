import { useMedia } from "@/lib/hooks";
import { Nft, OwnedNft } from "alchemy-sdk";
import clsx from "clsx";

/* eslint-disable @next/next/no-img-element */
interface Props {
  token: Nft | OwnedNft;
  chainId: number;
}

export const MediaViewer = ({ token, chainId }: Props) => {
  const { mediaUrl, isVideo } = useMedia({ token, chainId });
  const borderRadius = "rounded-2xl";

  if (isVideo) {
    return (
      <>
        {mediaUrl ? (
          <video
            className="aspect-square rounded-xl object-cover"
            muted
            autoPlay={true}
            loop={true}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <NoMedia className={borderRadius} />
        )}
      </>
    );
  }

  return (
    <>
      {mediaUrl ? (
        <img
          className="aspect-square rounded-xl object-cover"
          src={mediaUrl}
          alt="token image"
          width={1080}
          height={1080}
        />
      ) : (
        <NoMedia className={borderRadius} />
      )}
    </>
  );
};

function NoMedia({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center bg-gray-200 aspect-square",
        className
      )}
    >
      no media
    </div>
  );
}
