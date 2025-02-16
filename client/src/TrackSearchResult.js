import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="flex items-center m-2 p-2 cursor-pointer hover:bg-gray-800 rounded"
      onClick={handlePlay}
    >
      <img
        src={track.albumUrl}
        alt={track.title}
        className="h-16 w-16 rounded object-cover"
      />
      <div className="ml-4">
        <div className="text-white font-medium">{track.title}</div>
        <div className="text-gray-400 text-sm">{track.artist}</div>
      </div>
    </div>
  );
}
