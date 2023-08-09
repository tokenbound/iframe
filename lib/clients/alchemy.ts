import { Alchemy, Network } from "alchemy-sdk";
import getAlchemyNetwork from "../utils/getAlchemyNetwork";

export const getAlchemy = (chainId: number) => {
  const network = getAlchemyNetwork(chainId);

  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network,
  };
  const alchemy = new Alchemy(config);
  return alchemy;
};

export const alchemy = getAlchemy(
  process.env.NEXT_PUBLIC_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 1
);

const configLens = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_POLYGON,
  network: Network.MATIC_MAINNET,
};

export const alchemyLens = new Alchemy(configLens);
