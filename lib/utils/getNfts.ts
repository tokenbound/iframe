import { NftOrdering } from "alchemy-sdk";
import * as Sentry from "@sentry/nextjs";
import { alchemy, alchemyLens } from "@/lib/clients";

export async function getNfts(account: string) {
  try {
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
