import * as React from "react";
import { Nft } from "alchemy-sdk";
import { MediaViewer } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert"

const ParentPanelLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-white h-full rounded-t-3xl p-6">
      {children}
    </div>
  )
}

const ParentPanel = ({parent}:{parent: Nft}) => {
  if (!parent) {
    return (
      <ParentPanelLayout>
        No parent found
      </ParentPanelLayout>
    )
  }

  return (
    <ParentPanelLayout>
      <div className="text-2xl py-6">
        Owner
        <hr />
      </div>
      <Alert className="mb-6">
        <AlertDescription>
          The above autograph lives in following token&apos;s vault. These assets are owned by the token and can be controlled by the owner of the parent token.
        </AlertDescription>
      </Alert>
      <div className="flex flex-row gap-6">
        <div className="w-[250px]">
          <MediaViewer token={parent} chainId={1}/>
        </div>
        <div className="flex flex-col grow p-6 gap-3">
          <div className="flex flex-col">
            <div className="uppercase font-semibold text-xs">
              Collection
            </div>
            <div className="text-2xl font-bold">
              {parent.contract.name}
            </div>
          </div>
          <div className="flex flex-col">
          <div className="uppercase font-semibold text-xs">
              token id
            </div>
            <div className="text-2xl font-bold">
              #{parent.tokenId}
            </div>
          </div>
        </div>
      </div>
    </ParentPanelLayout>
  );
};

export default ParentPanel;
