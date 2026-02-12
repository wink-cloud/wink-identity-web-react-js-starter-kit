import { useEffect, useState, useRef } from "react";
import { getWinkLoginClient } from "wink-identity-sdk";
import { WinkContext } from "../contexts/WinkContext";

export default function WinkAuthProvider({ children }) {
  const [winkClient, setWinkClient] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const clientId = import.meta.env.VITE_WINK_CLIENT_ID;
    const realm = import.meta.env.VITE_WINK_REALM;
    const secret = import.meta.env.VITE_WINK_SECRET;
    const winkBaseUrl = import.meta.env.VITE_WINK_BASE_URL;
    const winkAuthUrl = import.meta.env.VITE_WINK_AUTH_URL;

    const config = {
      clientId,
      realm,
      secret,
      loggingEnabled: true,
      cancelUrl: `${window.location.origin}/callback`, // Path of callback URL
      onAuthErrorFailure: (error) =>
        console.error("Wink auth error:", error),
      override: true,
      overrideValues: {
        BASE_URL: winkBaseUrl,
        AUTH_URL: winkAuthUrl,
      },
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
