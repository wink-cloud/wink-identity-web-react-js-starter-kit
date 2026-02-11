import { useState } from "react";
import { useWinkAuth } from "./hooks/useWinkAuth";

function App() {
  const [hidden, setHidden] = useState(false);
  const winkClient = useWinkAuth();

  const onLoginClick = () => {
    winkClient.login();
    setHidden(true);
  };

  const onLogoutClick = () => {
    winkClient.logout();
    setHidden(false);
  };

  return (
    <div className="container">
      <h2>Wink Identity Verification</h2>
      <p>Click below to start identity verification</p>

      <button id="loginBtn" hidden={hidden} onClick={onLoginClick}>
        Login
      </button>
      <button id="logoutBtn" hidden={!hidden} onClick={onLogoutClick}>
        Logout
      </button>
    </div>
  );
}

export default App;
