import { OwnedNft } from "alchemy-sdk";
import { erc721Abi } from "@/lib/abi";
import { getPublicClient } from "@/lib/clients";
import useSWR from "swr";
import { chainIdToRpcUrl, graphApiKey } from "@/lib/constants";
import request from "graphql-request";

export const useGetApprovals = (ownedNfts: OwnedNft[], owner?: string, chainID = 1) => {
  const contractsString = ownedNfts?.map((item) => item.contract.address).join(",");
  const ignoreFetch = !owner || ownedNfts.length === 0;

  return useSWR(
    ignoreFetch ? null : `${owner}/${chainID}&contractAddresses=${contractsString}`,
    async () => {
      const response = await handleNftApprovals(ownedNfts, owner as string, chainID);

      return response;
    }
  );
};

export interface Nft extends OwnedNft {
  hasApprovals?: boolean;
}

function checkGlobalApproval(approvals: { approved: boolean }[]) {
  return approvals.reduce((result, item) => {
    return result || item.approved;
  }, false);
}

interface GetApproved {
  data?: boolean;
  error?: string;
}

export async function getApproved(
  account: string,
  tokenId: number,
  chainId: number
): Promise<GetApproved> {
  try {
    const providerUrl = chainIdToRpcUrl[chainId];
    const publicClient = getPublicClient(chainId, providerUrl);
    const response = (await publicClient.readContract({
      address: account as `0x${string}`,
      abi: erc721Abi,
      functionName: "getApproved",
      args: [tokenId],
    })) as string;

    return { data: response !== "0x0000000000000000000000000000000000000000" };
  } catch (error) {
    console.error(error);
    return {
      error: `Failed to get approval for token id: ${tokenId}, ${account}.`,
    };
  }
}

export async function getERC721ApprovedOperators(
  contractAddress: string,
  ownerAddress: string
): Promise<any> {
  const subgraphUrl = `https://gateway.thegraph.com/api/${graphApiKey}/subgraphs/id/AVZ1dGwmRGKsbDAbwvxNmXzeEkD48voB3LfGqj5w7FUS`;
  const query = `
    {
      erc721Operators(where:{contract:"${contractAddress}" owner:"${ownerAddress}"}) {
        approved
      }
    }
  `;

  try {
    const response = await request(subgraphUrl, query);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch approved operators from subgraph");
  }
}

export async function getERC1155ApprovedOperators(
  contractAddress: string,
  ownerAddress: string
): Promise<any> {
  const subgraphUrl = `https://gateway.thegraph.com/api/${graphApiKey}/subgraphs/id/GCQVLurkeZrdMf4t5v5NyeWJY8pHhfE9sinjFMjLYd9C`;
  const query = `
    {
      erc1155Operators(
        where:{
          contract:"${contractAddress}"
          owner:"${ownerAddress}"
        }
      ) {
        approved
      }
    }
  `;

  try {
    const response = await request(subgraphUrl, query);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch approved operators from subgraph");
  }
}

interface GetGlobalApprovalsForContractsReturn {
  data: { [contract: string]: boolean };
  error?: string;
}

export async function getGlobalApprovalsForContracts(
  contracts: { address: string; tokenType: "ERC721" | "ERC1155" }[],
  ownerAddress: string
): Promise<GetGlobalApprovalsForContractsReturn> {
  try {
    const promises = await Promise.all(
      contracts.map((contract) => {
        if (contract.tokenType === "ERC721") {
          return getERC721ApprovedOperators(contract.address, ownerAddress);
        }

        return getERC1155ApprovedOperators(contract.address, ownerAddress);
      })
    );

    const data = promises.reduce((a, b, i) => {
      if (b.erc721Operators) {
        const hasGlobalApprovals = checkGlobalApproval(b.erc721Operators);
        a[contracts[i].address] = hasGlobalApprovals;
      }

      if (b.erc1155Operators) {
        const hasGlobalApprovals = checkGlobalApproval(b.erc1155Operators);
        a[contracts[i].address] = hasGlobalApprovals;
      }

      return a;
    }, {} as { [contract: string]: boolean });

    return { data };
  } catch (err) {
    console.error(err);

    return {
      error: "Failed to fetch global approvals for contracts",
      data: {},
    };
  }
}

export async function handleNftApprovals(nfts: OwnedNft[], account: string, chainId: number) {
  try {
    // create a map of contracts from nfts
    const contracts = nfts.reduce((a, nft) => {
      const contractAddress = nft.contract.address;

      if (!a[contractAddress]) {
        a[contractAddress] = {
          address: contractAddress,
          tokenType: nft.contract.tokenType as "ERC721" | "ERC1155",
        };
      }

      return a;
    }, {} as { [contract: string]: { address: string; tokenType: "ERC721" | "ERC1155" } });

    // fetch global approvals for all nft contracts
    const { data: globalContractApprovalsMap, error: globalApprovalError } =
      await getGlobalApprovalsForContracts(Object.values(contracts), account);

    if (globalApprovalError) {
      console.error(globalApprovalError);
      return [];
    }

    const erc721Nfts = nfts.filter((nft) => nft.contract.tokenType === "ERC721");
    const erc1155Nfts = nfts.filter((nft) => nft.contract.tokenType === "ERC1155");

    const nftsToGetTokenApprovals: Nft[] = [];
    const erc721NftsWithGlobalApprovals: Nft[] = [];

    erc721Nfts.forEach((nft) => {
      const hasApprovals = globalContractApprovalsMap[nft.contract.address];

      if (hasApprovals) {
        erc721NftsWithGlobalApprovals.push({ ...nft, hasApprovals });
        return;
      }

      nftsToGetTokenApprovals.push(nft);
      return;
    });

    const approvals = await Promise.all(
      nftsToGetTokenApprovals.map((nft) =>
        getApproved(nft.contract.address, Number(nft.tokenId), chainId)
      )
    );

    const erc721NftsTokenApprovals = nftsToGetTokenApprovals.map((nft, i) => ({
      ...nft,
      hasApprovals: approvals[i].data ?? false,
    }));

    const erc1155NftsWithApprovalCheck = erc1155Nfts.map((nft) => ({
      ...nft,
      hasApprovals: !!globalContractApprovalsMap[nft.contract.address],
    }));

    return [
      ...erc721NftsWithGlobalApprovals.map((nft) => ({
        contract: nft.contract,
        tokenId: nft.tokenId,
        hasApprovals: nft.hasApprovals,
      })),
      ...erc721NftsTokenApprovals.map((nft) => ({
        contract: nft.contract,
        tokenId: nft.tokenId,
        hasApprovals: nft.hasApprovals,
      })),
      ...erc1155NftsWithApprovalCheck.map((nft) => ({
        contract: nft.contract,
        tokenId: nft.tokenId,
        hasApprovals: nft.hasApprovals,
      })),
    ];
  } catch (err) {
    console.error(err);

    return [];
  }
}
