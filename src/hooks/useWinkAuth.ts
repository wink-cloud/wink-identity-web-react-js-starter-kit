import { useContext } from "react";
import { WinkContext } from "../contexts/WinkContext";
import type { WinkAuthContextValue } from "../types/wink";

export const useWinkAuth = (): WinkAuthContextValue => {
  return useContext(WinkContext);
};
