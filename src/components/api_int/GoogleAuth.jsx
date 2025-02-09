import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const [authUrl, setAuthUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const CLIENT_ID = "415758528604-es4v53bag2qoke0aaclklf1jrfaosg1l.apps.googleusercontent.com";
    const REDIRECT_URI = "https://ca51-103-104-226-58.ngrok-free.app/email"; // Must match Google Console
    const SCOPE = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/calendar.events";

    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=token`;

    setAuthUrl(url);

    // Extract and store access token from URL after redirect
    const extractToken = () => {
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace("#", "?"));
        const accessToken = params.get("access_token");

        if (accessToken) {
          localStorage.setItem("google_access_token", accessToken);
          console.log("Access Token:", accessToken);
          navigate("/dashboard"); // Redirect to another page
        }
      }
    };

    extractToken();
  }, [navigate]);

  return (
    <div className="mail-btn text-white">
      <a href={authUrl} className="flex">
        <img src="/google.svg" width="35px" />
        <button>Login with Google</button>
      </a>
    </div>
  );
};

export default GoogleAuth;
