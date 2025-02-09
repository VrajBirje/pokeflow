import { createContext, useState, useEffect } from "react";

export const GoogleAuthContext = createContext();

export const GoogleProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("google_access_token");
    setUser(null);
  };

  return (
    <GoogleAuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
