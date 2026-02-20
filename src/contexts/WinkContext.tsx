import { createContext } from "react";
import type { WinkAuthContextValue } from "../types/wink";

const defaultValue: WinkAuthContextValue = {
  winkClient: null,
  userProfile: null,
  isAuthenticated: false,
  authState: "unauthenticated",
  authError: null,
  isProfileLoading: false,
  refreshUserProfile: () => {},
  login: () => {},
  logout: () => {},
};

export const WinkContext = createContext<WinkAuthContextValue>(defaultValue);
