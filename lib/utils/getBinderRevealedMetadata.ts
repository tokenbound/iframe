import { NftMetadata } from "alchemy-sdk";
import { getPublicClient } from "../clients";
import { chainIdToRpcUrl } from "../constants";
import { BINDER_DROP_ABI } from "./constants";

type BinderRevealedMetadata = NftMetadata & {
  image_canvas_data: string
}

export default async function getBinderRevealedMetadata (contractAddress: `0x${string}`, tokenId: string) {
  const providerUrl = chainIdToRpcUrl[11155111];
  const client = getPublicClient(11155111, providerUrl);

  // response should be an ipfs link for "revealed" art
  // revealed = has been signed on by the artist
  const response = (await client.readContract({
    address: contractAddress,
    abi: BINDER_DROP_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  })) as string;

  const fetchedMetadata = await (await fetch(
    response.includes("ipfs://") ?
    response.replace("ipfs://", "https://ipfs.io/ipfs/")
    :
    response
    )).json() as BinderRevealedMetadata;
  return fetchedMetadata;
}


