import { useEffect } from "react";

const GoogleLoader = ({ onLoad }) => {
  useEffect(() => {
    if (window.gapi) {
      onLoad();
    } else {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    }
  }, [onLoad]);

  return null;
};

export default GoogleLoader;
