import { useContext } from "react";
import { GoogleAuthContext } from "./GoogleContext";

const GoogleButton = () => {
  const { user, logout } = useContext(GoogleAuthContext);

  return user ? (
    <div>
      <p className="text-white">Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <a href="/google_int">
      <button>Login with Google</button>
    </a>
  );
};

export default GoogleButton;
