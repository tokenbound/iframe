
import { useMedia } from "@/lib/hooks";
import { Nft, OwnedNft } from "alchemy-sdk";
import clsx from "clsx";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
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

  if (!mediaUrl) {
    return <NoMedia className={borderRadius} />
  }

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {
          parentBaseImage && canvasData ?
          <SignatureCanvas baseImage={parentBaseImage} canvasData={canvasData} />
          :
          <img
            className="aspect-square rounded-lg object-cover"
            src={mediaUrl}
            alt="token image"
            width={1080}
            height={1080}
          />
        }
      </div>
    </>
  );
};

const SignatureCanvas = ({
  baseImage, canvasData
}: {
  baseImage?: string;
  canvasData: any;
}) => {
  const style = {
    backgroundImage: `${baseImage ? `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${baseImage})` : `bg-black` }`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
  };
  return (
    <CanvasDraw
      ref={(canvasDraw) => {
        if (canvasDraw && canvasData) {
          return canvasDraw.loadSaveData(canvasData);
        }
      }}
      brushColor={"white"}
      brushRadius={0}
      disabled
      hideGrid
      style={style}
    />
  )
}

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
