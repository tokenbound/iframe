"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { isNil } from "lodash";
import { useNft } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Variants, motion } from "framer-motion";
import ParentPanel from "./[contractAddress]/[tokenId]/[chainId]/ParentPanel";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { Nft } from "alchemy-sdk";
import { SignatureCanvas } from "@/components/ui";
import { useSearchParams } from 'next/navigation'
import useSWR from "swr";
import nameToNetwork from "@/lib/utils/nameToNetwork";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Token() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("for");
  const { data, error, isLoading: isLoadingOrder } = useSWR(`http://localhost:3001/api/campaigns/123/orders/${orderId}`, fetcher)

  const order = data?.order;

  const collectionNetwork = order?.collectionNetwork;
  const contractAddress = order?.collectionAddress;
  const tokenId = order?.selectedTokenId;
  const canvasData = JSON.parse(order?.autographData ?? "{}");
  const parentBaseImage = order?.nftImageURL;
  const toUpload = order?.toUpload;

  const showLoading = isLoadingOrder;

  const chainIdNumber = nameToNetwork(collectionNetwork) ?? 1;

  const {nftMetadata: parentNftMetadata, data: parentNftImages} = useNft({
    tokenId: parseInt(tokenId as string),
    contractAddress: contractAddress as `0x${string}`,
    chainId: chainIdNumber
  })

  const [isShowing, toggleShow] = useState<boolean>(false);

  const variants = {
    closed: { y: "100%", transition: { duration: 0.75 }, height: "0%" },
    open: { y: "0", transition: { duration: 0.35 }, height: "55%" },
  } as Variants;

  if (showLoading) {
    return <Skeleton className="h-full w-full bg-slate-400" />;
  }

  return (
    <>
        <div className="max-w-[1080px]">
          <div
            className="absolute top-0 left-0 z-10 cursor-pointer rounded-full m-3 p-1 text-zinc-900 transition-opacity duration-500 ease-in opacity-50 hover:opacity-100 bg-zinc-300"
            onClick={() => toggleShow(t => !t)}
          >
            {isShowing ? <ChevronDownCircle /> :<ChevronUpCircle /> }
          </div>
          <motion.div
            className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
            animate={isShowing ? "open" : "closed"}
            variants={variants}
            initial="closed"
          >
            <ParentPanel parent={parentNftMetadata as Nft} />
          </motion.div>
        </div>
      <div className={`bg-black w-full h-full`}>
        <div
          className={`group relative grid h-full w-full grid-cols-1 grid-rows-1 transition`}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <SignatureCanvas baseImage={parentBaseImage} canvasData={JSON.stringify(canvasData)} />
          </div>
        </div>
      </div>
    </>
  );
}
