
import { useMedia } from "@/lib/hooks";
import { Nft, OwnedNft } from "alchemy-sdk";
import clsx from "clsx";
import CanvasDraw from "react-canvas-draw";

/* eslint-disable @next/next/no-img-element */
interface Props {
  token: Nft | OwnedNft;
  chainId: number;
}

export const MediaViewer = ({ token, chainId }: Props) => {
  const { mediaUrl, isVideo, canvasData, parentBaseImage } = useMedia({ token, chainId });
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


  const style = {
    backgroundImage: `${parentBaseImage ? `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${parentBaseImage})` : `bg-black` }`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
    width: "100%",
    height: "100%"
  };

  if (canvasData) {
    return (
      <CanvasDraw
        ref={(canvasDraw) => {
          if (canvasDraw) {
            return canvasDraw.loadSaveData(canvasData);
          }
        }}
        brushColor={"white"}
        brushRadius={0}
        lazyRadius={5}
        disabled
        hideGrid
        style={style}
      />
    )
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
