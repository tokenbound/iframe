"use client";

import "./globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import { Inter } from "next/font/google";
import { getDefaultConfig } from "connectkit";
import { IFRAME_APP, IFRAME_ENABLED_CHAINS } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

const wagmiConfig = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    chains: IFRAME_ENABLED_CHAINS,
    appName: IFRAME_APP.NAME,
    appDescription: IFRAME_APP.DESCRIPTION,
    appUrl: IFRAME_APP.URL,
  })
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </body>
    </html>
  );
}
