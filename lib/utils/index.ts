import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export * from "./account";
export * from "./nft";
export * from "./shortenAddress";
export * from "./getAlchemyImageSrc";
export * from "./checkImage";
export * from "./getEtherscanLink";
export * from "./decodeBase64String";

