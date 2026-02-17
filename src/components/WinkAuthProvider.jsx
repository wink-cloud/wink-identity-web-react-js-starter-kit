import { useEffect, useState } from "react";
import { getWinkLoginClient } from "wink-identity-sdk";
import { WinkContext } from "../contexts/WinkContext";

const clearBrowserSessionArtifacts = () => {
  if (typeof window === "undefined") return;

  document.cookie.split(";").forEach((cookie) => {
    const separatorIndex = cookie.indexOf("=");
    const name = separatorIndex > -1 ? cookie.substring(0, separatorIndex) : cookie;
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  const storageKeysToClear = Object.keys(window.localStorage).filter(
    (key) =>
      key.includes("kc-callback") ||
      key.includes("wink") ||
      key.includes("token") ||
      key.includes("session")
  );

  storageKeysToClear.forEach((key) => {
    window.localStorage.removeItem(key);
  });

  window.sessionStorage.removeItem("wink_post_auth_next");
};

const AUTH_STATES = {
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOGGING_IN: "logging_in",
  LOGGING_OUT: "logging_out",
  LOADING_PROFILE: "loading_profile",
  ERROR: "error",
};

const MANUAL_LOGOUT_KEY = "wink_manual_logout";

const markManualLogout = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
};

const clearManualLogout = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
};

const hasManualLogoutMarker = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1";
};

const toAuthError = (step, error, fallbackMessage) => ({
  step,
  message: error instanceof Error ? error.message : fallbackMessage,
  details: error,
});

const buildOidcLogoutUrl = ({ authUrl, realm, clientId, idToken, redirectUri }) => {
  if (!authUrl || !realm || !clientId || !redirectUri) return null;

  const normalizedAuthUrl = authUrl.endsWith("/")
    ? authUrl.slice(0, -1)
    : authUrl;
  const base = `${normalizedAuthUrl}/realms/${encodeURIComponent(
    realm
  )}/protocol/openid-connect/logout`;
  const params = new URLSearchParams({
    post_logout_redirect_uri: redirectUri,
    client_id: clientId,
  });
  if (idToken) {
    params.set("id_token_hint", idToken);
  }

  return `${base}?${params.toString()}`;
};

export default function WinkAuthProvider({ children }) {
  const [winkClient, setWinkClient] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState(AUTH_STATES.UNAUTHENTICATED);
  const [authError, setAuthError] = useState(null);

  const loadUserProfile = async (client) => {
    if (!client) return;

    try {
      setAuthState(AUTH_STATES.LOADING_PROFILE);
      const user = await client.getUser();
      setUserProfile(user ?? null);
      if (user) {
        setIsAuthenticated(true);
        setAuthState(AUTH_STATES.AUTHENTICATED);
      } else {
        setIsAuthenticated(false);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
      }
    } catch (error) {
      console.error("Unable to load Wink user profile:", error);
      setUserProfile(null);
      setIsAuthenticated(false);
      setAuthError(
        toAuthError("PROFILE_FETCH", error, "Unable to load user profile.")
      );
      setAuthState(AUTH_STATES.ERROR);
    }
  };

  useEffect(() => {
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
      cancelUrl: `${window.location.origin}/callback`,
      onAuthErrorFailure: (error) =>
        console.error("Wink auth error:", error),
      override: true,
      overrideValues: {
        BASE_URL: winkBaseUrl,
        AUTH_URL: winkAuthUrl,
      },
    };

    let client = null;
    try {
      client = getWinkLoginClient(config);
    } catch (error) {
      Promise.resolve().then(() => {
        setIsAuthenticated(false);
        setAuthState(AUTH_STATES.ERROR);
        setAuthError(
          toAuthError("INIT_CONFIG", error, "Unable to create Wink client.")
        );
      });
      return;
    }

    setWinkClient(client);
    setAuthError(null);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);

    try {
      client.winkInit({
        silentCheckSsoRedirectUri: "http://localhost:3000/silent-check-sso.html",
        onFailure(error) {
          console.error(error);
          setIsAuthenticated(false);
          setAuthState(AUTH_STATES.UNAUTHENTICATED);
          setAuthError(
            toAuthError("INIT", error, "Wink initialization failed.")
          );
        },
        async onSuccess() {
          if (hasManualLogoutMarker()) {
            setIsAuthenticated(false);
            setUserProfile(null);
            setAuthState(AUTH_STATES.UNAUTHENTICATED);
            return;
          }

          setAuthError(null);
          setIsAuthenticated(true);
          await loadUserProfile(client);
        },
      });
    } catch (error) {
      setIsAuthenticated(false);
      setAuthState(AUTH_STATES.ERROR);
      setAuthError(
        toAuthError(
          "INIT_RUNTIME",
          error,
          "Wink initialization failed before callbacks."
        )
      );
    }

    return undefined;
  }, []);

  const login = () => {
    if (!winkClient) return;
    clearManualLogout();
    setAuthError(null);
    setAuthState(AUTH_STATES.LOGGING_IN);
    winkClient.winkLogin({
      // Force interactive authentication instead of silent SSO reuse.
      prompt: "login",
      maxAge: 0,
      onFailure(error) {
        console.error(error);
        setIsAuthenticated(false);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        setAuthError(toAuthError("LOGIN", error, "Wink login failed."));
      },
    });
  };

  // ---- Logout ----
  const logout = () => {
    if (!winkClient) return;
    markManualLogout();
    setAuthError(null);
    setAuthState(AUTH_STATES.LOGGING_OUT);
    setIsAuthenticated(false);
    setUserProfile(null);
    clearBrowserSessionArtifacts();

    const hardLogoutUrl = buildOidcLogoutUrl({
      authUrl: import.meta.env.VITE_WINK_AUTH_URL,
      realm: import.meta.env.VITE_WINK_REALM,
      clientId: import.meta.env.VITE_WINK_CLIENT_ID,
      idToken: winkClient.idToken,
      redirectUri: window.location.origin,
    });

    if (hardLogoutUrl) {
      window.location.assign(hardLogoutUrl);
      return;
    }

    setAuthState(AUTH_STATES.ERROR);
    setAuthError(
      toAuthError(
        "LOGOUT_CONFIG",
        new Error("Missing OIDC logout configuration."),
        "Unable to build OIDC logout URL."
      )
    );
  };

  const value = {
    winkClient,
    userProfile,
    isAuthenticated,
    authState,
    authError,
    isProfileLoading: authState === AUTH_STATES.LOADING_PROFILE,
    refreshUserProfile: () => loadUserProfile(winkClient),
    login,
    logout,
  };

  return (
    <WinkContext.Provider value={value}>
      {children}
    </WinkContext.Provider>
  );
}
