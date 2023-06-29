import { Nft, OwnedNft } from "alchemy-sdk";

export function getAlchemyImageSrc(token?: Nft | OwnedNft) {
  // mint count for selected tokens

  if (!token) {
    return "/no-img.jpg";
  }

  const src =
    token.media[0]?.gateway ||
    token.media[0]?.thumbnail ||
    token.contract?.openSea?.imageUrl ||
    "/no-img.jpg";

  return src;
}
