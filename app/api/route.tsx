import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { NextResponse, type NextRequest } from "next/server";

// grab an ipfs metadara link and resolve to  valid ipfs urls
export async function POST(request: NextRequest) {
  const { ipfsUrl } = await request.json();
  let originalIpfsUrl = ipfsUrl;
  if (ipfsUrl.includes("https://ipfs.io/ipfs/")) {
    originalIpfsUrl = ipfsUrl.replace("https://ipfs.io/ipfs/", "ipfs://");
  }
  const storage = new ThirdwebStorage({
    secretKey: process.env.NEXT_PUBLIC_THIRD_WEB_KEY,
  });
  const url = await storage.resolveScheme(ipfsUrl);
  return NextResponse.json({ url });
}
