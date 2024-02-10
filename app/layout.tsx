import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Binder iframe",
  description: "View your nft's tokenbound signatures",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} vaul-drawer-wrapper="">{children}</body>
    </html>
  );
}
