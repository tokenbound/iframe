import "./globals.css";

export const metadata = {
  title: "Galverse Cosmic Inventory",
  description: "View your Gal's Cosmic Inventory and Upgrades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
