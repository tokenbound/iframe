/* eslint-disable @next/next/no-img-element */

interface Props {
  url: string;
  isVideo: boolean;
}

export const MediaViewer = ({ url, isVideo = false }: Props) => {
  if (isVideo) {
    let videoUrl = url;
    const ipfs = url.includes("ipfs");
    if (ipfs) {
      videoUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return (
      <video className="aspect-square rounded-xl object-cover" muted autoPlay={true} loop={true}>
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      className="aspect-square rounded-xl object-cover"
      src={url}
      alt="token image"
      width={1080}
      height={1080}
    />
  );
};
