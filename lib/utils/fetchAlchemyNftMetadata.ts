/**
 * Fetch NFT metadata via Alchemy NFT API v3 REST.
 *
 * alchemy-sdk@2's getNftMetadata / getNftMetadataBatch break against the current
 * Alchemy response shape (e.g. batch returns `{ nfts: [...] }` instead of an array,
 * which throws `response.map is not a function`). Calling v3 REST directly avoids
 * that and keeps iframe artwork loading for collections that rely on Alchemy.
 */
const chainIdToAlchemyNftNetwork: Record<number, string> = {
  1: "eth-mainnet",
  5: "eth-goerli",
  11155111: "eth-sepolia",
  10: "opt-mainnet",
  420: "opt-goerli",
  137: "polygon-mainnet",
  80001: "polygon-mumbai",
  84532: "base-sepolia",
  8453: "base-mainnet",
};

/** Alchemy NFT API v3 response, plus a `title` alias for older UI code. */
export type AlchemyNftMetadata = {
  title: string;
  name?: string;
  description?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    originalUrl?: string;
  };
  media?: { gateway?: string; thumbnail?: string }[];
  raw?: { metadata?: { image?: string } };
  rawMetadata?: { image?: string };
  contract?: {
    openSea?: { imageUrl?: string };
    openSeaMetadata?: { imageUrl?: string };
  };
  [key: string]: unknown;
};

export async function fetchAlchemyNftMetadata(
  contractAddress: string,
  tokenId: string | number,
  chainId: number
): Promise<AlchemyNftMetadata> {
  const network = chainIdToAlchemyNftNetwork[chainId];
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

  if (!network) {
    throw new Error(`Unsupported chainId for Alchemy NFT API: ${chainId}`);
  }
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_ALCHEMY_KEY");
  }

  const url = new URL(`https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata`);
  url.searchParams.set("contractAddress", contractAddress);
  url.searchParams.set("tokenId", String(tokenId));
  url.searchParams.set("refreshCache", "false");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Alchemy NFT metadata error: ${response.status}`);
  }

  const data = await response.json();

  // UI still reads `title`; Alchemy v3 returns `name`.
  return {
    ...data,
    title: data.name || data.title || "",
  };
}
