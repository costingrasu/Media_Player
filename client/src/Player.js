import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;

  return (
    <div
      className={"bg-gray-800 p-4"}
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {trackUri ? (
        <SpotifyPlayer
          token={accessToken}
          showSaveIcon
          play={true}
          uris={trackUri ? [trackUri] : []}
          hideAttribution={true} 
          layout="responsive" 
          styles={{
            activeColor: "#1DB954",
            bgColor: "#1f2937",
            color: "#ffffff",
            errorColor: "#f87171",
            height: 70,
            loaderColor: "#1DB954",
            sliderColor: "#3b82f6",
            sliderHandleColor: "#ffffff",
            trackArtistColor: "#9ca3af",
            trackNameColor: "#ffffff",
          }}
          callback={(state) => {
            if (!state.isPlaying) setPlay(false);
          }}
        />
      ) : (
        <div className="text-gray-400">No track selected</div>
      )}
    </div>
  );
}
