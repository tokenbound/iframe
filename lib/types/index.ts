import { NftContract, OwnedNft } from "alchemy-sdk";

export interface TbaOwnedNft extends OwnedNft {
  hasApprovals?: boolean | undefined;
  [key: string]: any;
}

export interface TokenInfo {
  collection: string | undefined;
  title: string | undefined;
  approvals?: boolean | undefined;
}

export interface NftApprovalStatus {
  contract: string | NftContract;
  hasApprovals?: boolean;
  tokenId: string;
}
