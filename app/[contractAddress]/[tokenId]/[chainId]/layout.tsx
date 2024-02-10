export const metadata = {
  title: "Binder iFrame",
  description: "View your nft's tokenbound signatures",
};

export default function FrameLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
