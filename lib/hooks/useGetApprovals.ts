import useSWR from "swr";
import { nxyzApiKey, nxyzUrl } from "@/lib/constants";

export const useGetApprovals = (contracts: string[], owner?: string, chainID = "ethereum") => {
  const contractsString = contracts.join(",");
  const encodedContracts = encodeURIComponent(contractsString);
  const apiUrl = `${nxyzUrl}/address/${owner}/allowances?chainID=${chainID}&contractAddresses=${encodedContracts}&apikey=${nxyzApiKey}`;
  const ignoreFetch = !owner || !contracts || contracts.length === 0;

  return useSWR(ignoreFetch ? null : apiUrl, async (url) => {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    const headers = response.headers.get("Content-Type");

    return await response.json();
  });
};
