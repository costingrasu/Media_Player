# 🎵 Media Player - A Spotify-Connected Web App
**Media Player** is a React-based web application that integrates with **Spotify** to let users search, play, and manage their music. It supports **PWA installation**, enabling users to install it like a native app.

---

## Features
✔️ **Spotify Authentication** – Login using your Spotify account.  
✔️ **Search & Play Songs** – Search for songs and play them instantly.  
✔️ **Create & Manage Playlists** – Add songs to your Spotify playlists.  
✔️ **Lyrics Support** – Fetch lyrics for the currently playing song.  
✔️ **Installable PWA** – Works like a native app on mobile & desktop.  
✔️ **Responsive UI** – Optimized for all screen sizes.  

---

## Installation & Setup
### 1️. Clone the Repository
```sh
git clone https://github.com/costingrasu/Media_Player
cd Media_Player
```

### 2️. Install Dependencies
```sh
npm install
```

### 3️. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_REDIRECT_URI=https://your-app-url.com
```
Replace `your_spotify_client_id` and `your-app-url.com` with your actual **Spotify Developer credentials**.

### 4️. Start the Development Server
```sh
npm start
```
The app will be available at **`http://localhost:3000`**.

---

## Spotify API Setup
To enable **Spotify authentication**, follow these steps:

1. **Go to** [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. **Create an App** → Get **Client ID**.
3. **Set the Redirect URI**:
   - If using **localhost**: `http://localhost:3000`
4. **Add Scopes**:
   ```
   streaming user-read-email user-read-private user-library-read user-library-modify 
   user-read-playback-state user-modify-playback-state playlist-modify-public 
   playlist-modify-private playlist-read-private
   ```

---

## PWA Installation
This app supports **Progressive Web App (PWA)** installation.

### How to Install:
- **Desktop**: Open in **Chrome**, click the **install icon** in the address bar.
- **Mobile (Android)**: Open in **Chrome**, tap **⋮ → Install App**.
- **iOS (Safari)**: Tap **Share → Add to Home Screen**.

### PWA Features:
- Runs **like a native app** on mobile & desktop.
- **No browser UI** for a full-screen experience.

---
