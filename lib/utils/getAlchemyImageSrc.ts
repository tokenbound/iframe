import { AlchemyNftMetadata } from "./fetchAlchemyNftMetadata";

/**
 * Resolve a displayable image URL from Alchemy NFT metadata.
 * Prefers legacy SDK `media` fields, then Alchemy NFT API v3 `image` / raw metadata,
 * then OpenSea collection fallbacks.
 */
export function getAlchemyImageSrc(token?: AlchemyNftMetadata | null) {
  if (!token) {
    return "/no-img.jpg";
  }

  const src =
    token.media?.[0]?.gateway ||
    token.media?.[0]?.thumbnail ||
    // Alchemy NFT API v3
    token.image?.cachedUrl ||
    token.image?.pngUrl ||
    token.image?.originalUrl ||
    token.raw?.metadata?.image ||
    // Legacy SDK shape
    token.rawMetadata?.image ||
    token.contract?.openSea?.imageUrl ||
    token.contract?.openSeaMetadata?.imageUrl ||
    "/no-img.jpg";

  return src;
}
