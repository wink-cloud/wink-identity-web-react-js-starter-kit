import { useEffect, useState, useRef } from "react";
import { getWinkLoginClient } from "wink-identity-sdk";
import { WinkContext } from "../contexts/WinkContext";

export default function WinkAuthProvider({ children }) {
  const [winkClient, setWinkClient] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const config = {
      clientId: "__client_id__",
      realm: "__realm__",
      secret: "__secret__",
      loggingEnabled: true,
      cancelUrl: "http://localhost:3000/callback", // Path of callback URL
      onAuthErrorFailure: (error) => console.error(error),
    };
    const client = getWinkLoginClient(config);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWinkClient(client);
    client.winkInit({
      silentCheckSsoRedirectUri: "http://localhost:3000/silent-check-sso.html", // silent login check html
      onFailure(error) {
        console.error(error);
      },
      async onSuccess() {
        const user = await client.getUser();
        console.log("user", user);
      },
    });
  }, []);

  const login = () => {
    if (!winkClient) return;
    winkClient.winkLogin({
      onFailure(error) {
        console.error(error);
      },
    });
  };

  // ---- Logout ----
  const logout = () => {
    if (!winkClient) return;
    winkClient.winkLogout({
      onFailure(error) {
        console.error(error);
      },
    });
  };

  const value = {
    winkClient,
    login,
    logout,
  };

  return (
    <WinkContext.Provider value={value}>
      {children}
    </WinkContext.Provider>
  );
}
