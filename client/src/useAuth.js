import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [codeUsed, setCodeUsed] = useState(false); 

  useEffect(() => {
    if (!code || codeUsed) return; 
    setCodeUsed(true); 

    axios
      .post("http://localhost:3001/login", { code })
      .then((res) => {
        console.log("Response from /login:", res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.error("Login Request Error:", err);
        window.location = "/"; 
      });
  }, [code, codeUsed]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      console.log("Refreshing access token...");
      axios
        .post("http://localhost:3001/refresh", { refreshToken })
        .then((res) => {
          console.log("Refreshed Access Token:", res.data.accessToken);
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          console.error("Refresh Error:", err);
          window.location = "/"; 
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval); 
  }, [refreshToken, expiresIn]);

  return accessToken;
}



