import { NftOrdering } from "alchemy-sdk";
import * as Sentry from "@sentry/nextjs";
import { MAX_TOKEN_ID, nftUrl } from "@/lib/constants";
import { alchemyLens, getAlchemy } from "@/lib/clients";

export async function getNfts(chainId: number, account: string) {
  try {
    const alchemy = getAlchemy(chainId);
    const response = await alchemy.nft.getNftsForOwner(account, {
      orderBy: NftOrdering.TRANSFERTIME,
    });
    if (!response.ownedNfts) {
      return [];
    }

    return response.ownedNfts.reverse();
  } catch (err) {
    console.error(err);
    Sentry.captureMessage(`getNfts error`, {
      tags: {
        reason: "nfts",
      },
      extra: {
        prepareError: err,
      },
    });
    return [];
  }
}

export async function getLensNfts(account: string) {
  try {
    const response = await alchemyLens.nft.getNftsForOwner(account, {
      orderBy: NftOrdering.TRANSFERTIME,
    });

    if (!response.ownedNfts) {
      return [];
    }

    const filteredLensHandles = response.ownedNfts.filter(
      (token) => token.contract.address == "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d"
    );

    return filteredLensHandles.reverse();
  } catch (err) {
    console.error(err);
    Sentry.captureMessage(`getNfts error`, {
      tags: {
        reason: "nfts",
      },
      extra: {
        prepareError: err,
      },
    });
    return [];
  }
}

type TokenId = number & { __tokenIdBrand: never };

function isTokenId(value: number): value is TokenId {
  return value >= 0 && value <= MAX_TOKEN_ID;
}

export async function getNftAsset(
  tokenId: number,
  apiEndpoint?: string
): Promise<string[] | string> {
  if (isTokenId(tokenId)) {
    const response = await fetch(`${apiEndpoint || nftUrl}/${tokenId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    // return data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    throw new Error(`TokenId must be between 0 and ${MAX_TOKEN_ID}`);
  }
}
