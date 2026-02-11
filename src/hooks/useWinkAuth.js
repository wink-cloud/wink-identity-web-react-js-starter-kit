import { useContext } from "react";
import { WinkContext } from "../contexts/WinkContext";

export const useWinkAuth = () => {
  return useContext(WinkContext);
};