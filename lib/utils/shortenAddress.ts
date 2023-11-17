export function shortenAddress(address?: string): string {
  console.log({ address });
  if (!address) return "";
  const start = address.slice(0, 4);
  const end = address.slice(-3);
  return `${start}...${end}`;
}
