require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node")
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/login", (req, res) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      console.log("Access Token:", data.body.access_token);
      console.log("Refresh Token:", data.body.refresh_token);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error("Login Error:", err);
      res.sendStatus(400); 
    });
});


app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      console.log("New Access Token:", data.body.access_token);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error("Refresh Error:", err);
      res.sendStatus(400);
    });
});

app.post("/add-track", (req, res) => {
  const { accessToken, playlistId, trackUri } = req.body;

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .addTracksToPlaylist(playlistId, [trackUri])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error("Error adding track to playlist:", err);
      res.sendStatus(400);
    });
});

app.get("/user-playlists", (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const userId = req.query.userId; 
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getUserPlaylists(userId, { limit, offset })
    .then((data) => {
      res.json(data.body);
    })
    .catch((err) => {
      console.error("Error fetching playlists:", err.response?.data || err.message);
      res.status(400).json({ error: "Failed to fetch playlists" });
    });
});


app.get("/me", (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMe()
    .then((data) => {
      res.json(data.body);
    })
    .catch((err) => {
      console.error("Error fetching user profile:", err);
      res.sendStatus(400);
    });
});

app.post("/create-playlist", (req, res) => {
  const { accessToken, userId, playlistName } = req.body;

  if (!accessToken || !userId || !playlistName) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  const playlistData = {
    name: playlistName,
    public: false
  };

  console.log("Creating playlist with data:", playlistData);

  spotifyApi
    .createPlaylist(userId, playlistData)
    .then((data) => {
      res.json({ playlistId: data.body.id });
    })
    .catch((err) => {
      console.error("Error creating playlist:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to create playlist" });
    });
});


app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})

app.listen(3001)