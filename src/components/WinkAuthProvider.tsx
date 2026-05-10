import { useEffect, useState } from "react";
import { getWinkLoginClient } from "wink-identity-sdk";
import { WinkContext } from "../contexts/WinkContext";
import {
  AUTH_STATES,
  toAuthError,
  fetchUserFromBackend,
  fetchSessionFromBackend,
  getWinkConfig,
} from "../lib/winkAuth";
import type { WinkAuthContextValue, WinkUserProfile } from "../types/wink";

interface WinkAuthProviderProps {
  children: React.ReactNode;
}

export default function WinkAuthProvider({ children }: WinkAuthProviderProps) {
  const [winkClient, setWinkClient] = useState<ReturnType<typeof getWinkLoginClient> | null>(null);
  const [userProfile, setUserProfile] = useState<WinkUserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState<WinkAuthContextValue["authState"]>(AUTH_STATES.UNAUTHENTICATED);
  const [authError, setAuthError] = useState<WinkAuthContextValue["authError"]>(null);

  const loadUserProfile = async (client: ReturnType<typeof getWinkLoginClient> | null) => {
    if (!client) return;

    const backendUrl = import.meta.env.VITE_WINK_BACKEND_URL;
    if (!backendUrl) {
      setAuthError(
        toAuthError(
          "PROFILE_FETCH",
          new Error("VITE_WINK_BACKEND_URL is required (user profile is only available via backend)."),
          "Backend URL not configured."
        )
      );
      setAuthState(AUTH_STATES.ERROR);
      return;
    }

    try {
      setAuthState(AUTH_STATES.LOADING_PROFILE);
      const clientId = import.meta.env.VITE_WINK_CLIENT_ID;
      const token = (client as { token?: string; idToken?: string }).token ?? (client as { idToken?: string }).idToken;
      if (!token) {
        throw new Error("No token available for backend user request.");
      }
      const user = await fetchUserFromBackend(backendUrl, clientId, token);
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
      setAuthError(toAuthError("PROFILE_FETCH", error, "Unable to load user profile."));
      setAuthState(AUTH_STATES.ERROR);
    }
  };

  useEffect(() => {
    const config = getWinkConfig();

    let client: ReturnType<typeof getWinkLoginClient> | null = null;
    try {
      client = getWinkLoginClient(config as Parameters<typeof getWinkLoginClient>[0]);
    } catch (error) {
      Promise.resolve().then(() => {
        setIsAuthenticated(false);
        setAuthState(AUTH_STATES.ERROR);
        setAuthError(toAuthError("INIT_CONFIG", error, "Unable to create Wink client."));
      });
      return;
    }

    setWinkClient(client);
    setAuthError(null);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);

    try {
      client.winkInit({
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        onFailure(error: unknown) {
          console.error(error);
          setIsAuthenticated(false);
          setAuthState(AUTH_STATES.UNAUTHENTICATED);
          setAuthError(toAuthError("INIT", error, "Wink initialization failed."));
        },
        async onSuccess() {
          setAuthError(null);
          setIsAuthenticated(true);
          await loadUserProfile(client);
        },
      });
    } catch (error) {
      setIsAuthenticated(false);
      setAuthState(AUTH_STATES.ERROR);
      setAuthError(
        toAuthError("INIT_RUNTIME", error, "Wink initialization failed before callbacks.")
      );
    }

    return undefined;
  }, []);

  const login = async () => {
    if (!winkClient) return;

    const backendUrl = import.meta.env.VITE_WINK_BACKEND_URL;
    if (!backendUrl) {
      setAuthError(
        toAuthError(
          "LOGIN",
          new Error("VITE_WINK_BACKEND_URL is required (session is only created via backend)."),
          "Backend URL not configured."
        )
      );
      setAuthState(AUTH_STATES.ERROR);
      return;
    }

    setAuthError(null);
    setAuthState(AUTH_STATES.LOGGING_IN);

    try {
      const returnUrl = window.location.origin + window.location.pathname;
      const cancelUrl = `${window.location.origin}/callback`;
      const session = await fetchSessionFromBackend(backendUrl, returnUrl, cancelUrl);

      const sessionId =
        session.sessionId ?? session.SessionId ?? session.id ?? session.session_id;
      if (!sessionId) {
        throw new Error("Backend session response has no sessionId.");
      }

      await winkClient.winkLogin({
        sessionId,
        redirectUri: returnUrl,
        onFailure(error: unknown) {
          console.error(error);
          setIsAuthenticated(false);
          setAuthState(AUTH_STATES.UNAUTHENTICATED);
          setAuthError(toAuthError("LOGIN", error, "Wink login failed."));
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setAuthState(AUTH_STATES.ERROR);
      setAuthError(toAuthError("LOGIN", error, "Failed to get session from backend."));
    }
  };

  const logout = () => {
    if (!winkClient) return;
    setAuthError(null);
    setAuthState(AUTH_STATES.LOGGING_OUT);
    setIsAuthenticated(false);
    setUserProfile(null);

    winkClient.winkLogout({
      redirectUri: window.location.origin,
      onFailure(error: unknown) {
        console.error("Wink logout failed:", error);
        setAuthState(AUTH_STATES.ERROR);
        setAuthError(toAuthError("LOGOUT", error, "Logout failed."));
      },
    });
  };

  const value: WinkAuthContextValue = {
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

  return <WinkContext.Provider value={value}>{children}</WinkContext.Provider>;
}
