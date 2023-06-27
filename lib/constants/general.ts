import { nftUrl } from "@/lib/constants";

export const MAX_TOKEN_ID = Number(process.env.NEXT_PUBLIC_MAX_TOKEN_ID) || 10000;
export const HAS_CUSTOM_IMPLEMENTATION = !!nftUrl;
