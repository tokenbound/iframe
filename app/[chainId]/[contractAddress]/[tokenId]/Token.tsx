import getIpfsLink from "@/lib/utils/getIpfsLink";
import { useMemo, useState } from "react";

/* eslint-disable @next/next/no-img-element */
const Token = ({ token }: any) => {
  const songHash = token.rawMetadata.animation_url;
  const audio = useMemo(() => new Audio(getIpfsLink(songHash)), [songHash]);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = async () => {
    if (!playing) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <li onClick={toggleAudio} className="list-none">
      <img
        src={`${token.media[0]?.gateway}`}
        alt="Nft image"
        className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
      />
    </li>
  );
};

export default Token;
