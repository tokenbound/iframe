
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
  const [isCanvas, toggleCanvas] = useState<boolean>(false);
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
      <div className="relative w-[450px] h-[450px]">
        {
          isCanvas ?
          <SignatureCanvas baseImage={parentBaseImage} canvasData={canvasData} />
          :
          <img
            className="aspect-square rounded-xl object-cover"
            src={mediaUrl}
            alt="token image"
            width={1080}
            height={1080}
          />
        }
        <div className="absolute top-0 left-0 p-2 cursor-pointer hover:scale-110 transition duration-200 ease-in" onClick={() => toggleCanvas(true)}><PlayCircle className="w-6 h-6 text-white" /></div>
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
    width: "100%",
    height: "100%"
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
      lazyRadius={5}
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
