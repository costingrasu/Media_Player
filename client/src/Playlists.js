export default function Playlists({ playlists, addTrackToPlaylist }) {
  return (
    <div className="text-center">
      <h5 className="text-lg font-bold text-white mb-4">Select a Playlist</h5>
      <div className="flex flex-wrap justify-center gap-4">
        {playlists.map((playlist) => {
          const playlistImage =
            playlist.images && playlist.images.length > 0
              ? playlist.images[0].url
              : require("./no-image.png");

          return (
            <div
              key={playlist.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => addTrackToPlaylist(playlist.id)}
            >
              <img
                src={playlistImage}
                alt={playlist.name}
                className="w-24 h-24 rounded-md object-cover shadow-md"
              />
              <div className="mt-2 text-white text-sm text-center">{playlist.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
