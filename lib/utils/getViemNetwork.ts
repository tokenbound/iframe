import { goerli, mainnet, optimism, polygon, polygonMumbai } from "viem/chains";

const getViemNetwork = (chainId: number) => {
    if (chainId === 1) return mainnet
    if (chainId === 137) return polygon
    if (chainId === 420) return optimism
    if (chainId === 5) return goerli
    if (chainId === 80001) return polygonMumbai
}

export default getViemNetwork