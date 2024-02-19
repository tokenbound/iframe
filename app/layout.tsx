import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Binder iframe",
  description: "View your nft's tokenbound signatures",
};
//hello
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <section>
          <div className="h-screen w-screen bg-slate-100">
            <div className="max-w-screen relative mx-auto aspect-square max-h-screen overflow-hidden bg-white">
              <div className="relative h-full w-full">
                <div className="max-h-1080[px] relative h-full w-full max-w-[1080px]">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
