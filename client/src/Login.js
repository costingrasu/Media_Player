import React from "react";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=c9b9e802c0d9414c8351d0f3498fb830&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private%20playlist-read-private";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <a
        className="px-8 py-4 bg-green-500 text-white text-lg font-bold rounded hover:bg-green-600"
        href={AUTH_URL}
      >
        Login With Spotify
      </a>
    </div>
  );
}
