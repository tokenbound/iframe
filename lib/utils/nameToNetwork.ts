export default function nameToNetwork(name: string): number {
  name = name?.toLowerCase();
  if (name === "ethereum") {
    return 1;
  }
  if (name === "polygon") {
    return 137;
  }
  if (name === "base") {
    return 8453;
  }
  if (name === "optimism") {
    return 10;
  }
  if (name === "goerli") {
    return 5;
  }
  if (name === "sepolia") {
    return 11155111;
  }
  return 1;
}