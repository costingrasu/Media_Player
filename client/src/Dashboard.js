import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import Playlists from "./Playlists";
import TrackSearchResult from "./TrackSearchResult";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "c9b9e802c0d9414c8351d0f3498fb830",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [userId, setUserId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
    setShowPlaylists(false);
  }

  function handleCreatePlaylist() {
    if (!userId) {
      console.error("User ID not available");
      return;
    }

    axios
      .post("http://localhost:3001/create-playlist", {
        accessToken: accessToken,
        userId: userId,
        playlistName: playlistName,
      })
      .then((res) => {
        console.log("Playlist Created:", res.data.playlistId);
        setPlaylistCreated(true);
        setPlaylistName("");
      })
      .catch((err) => {
        console.error("Error creating playlist:", err);
      });
  }

  function fetchPlaylists() {
    axios
      .get("http://localhost:3001/user-playlists", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          userId: userId,
          limit: 50,
          offset: 0,
        },
      })
      .then((res) => {
        setPlaylists(res.data.items);
        setShowPlaylists(true);
      })
      .catch((err) => {
        console.error("Error fetching playlists:", err);
      });
  }

  function addTrackToPlaylist(playlistId) {
    axios
      .post("http://localhost:3001/add-track", {
        accessToken: accessToken,
        playlistId: playlistId,
        trackUri: playingTrack.uri,
      })
      .then(() => {
        console.log(`Track added to playlist: ${playlistId}`);
        setShowPlaylists(false);
      })
      .catch((err) => {
        console.error("Error adding track to playlist:", err);
      });
  }

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get("http://localhost:3001/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("User ID:", res.data.id);
        setUserId(res.data.id);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  }, [accessToken]);

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <div className="flex flex-col h-screen p-5 bg-gray-900 text-white">
      <input
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full rounded bg-gray-800 text-white"
      />

      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="New Playlist Name"
            value={playlistName}
            onChange={(e) => {
              setPlaylistName(e.target.value);
              setPlaylistCreated(false);
            }}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleCreatePlaylist}
            disabled={!playlistName}
            className={`mt-2 w-full p-2 rounded ${
              playlistName
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Create Playlist
          </button>
          {playlistCreated && (
            <div className="text-green-500 mt-2 text-center">
              Playlist created successfully!
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto bg-gray-800 rounded p-4">
        {showPlaylists ? (
          <Playlists playlists={playlists} addTrackToPlaylist={addTrackToPlaylist} />
        ) : searchResults.length > 0 ? (
          searchResults.map((track) => (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          ))
        ) : (
          <div className="text-center whitespace-pre">{lyrics}</div>
        )}
      </div>

      <div
        className="flex justify-center items-center bg-gray-800 p-4 rounded shadow-md"
        style={{
          width: "100%",
          maxWidth: "800px", 
          margin: "0 auto", 
        }}
      >
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        {playingTrack && (
          <button
            onClick={fetchPlaylists}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add to Playlist
          </button>
        )}
      </div>
    </div>
  );
}
