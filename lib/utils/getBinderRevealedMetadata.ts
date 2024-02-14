import { NftMetadata } from "alchemy-sdk";
import { getPublicClient } from "../clients";
import { chainIdToRpcUrl } from "../constants";
import { BINDER_DROP_ABI } from "./constants";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

type BinderRevealedMetadata = NftMetadata & {
  image_canvas_data: string;
};

export default async function getBinderRevealedMetadata(
  contractAddress: `0x${string}`,
  tokenId: string
) {
  const providerUrl = chainIdToRpcUrl[8453];
  const client = getPublicClient(8453, providerUrl);

  // response should be an ipfs link for "revealed" art
  // revealed = has been signed on by the artist
  const response = (await client.readContract({
    address: contractAddress,
    abi: BINDER_DROP_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  })) as string;
  console.log("fetching");

  const ipfsUrl = response.includes("ipfs://")
    ? response.replace("ipfs://", "https://ipfs.io/ipfs/")
    : response;

  const haharesponse = await fetch("/api", {
    method: "POST",
    body: JSON.stringify({
      ipfsUrl: response,
    }),
  });
  const { url } = await haharesponse.json();
  const fetchedMetadata = (await (await fetch(url)).json()) as BinderRevealedMetadata;

  return fetchedMetadata;
}
