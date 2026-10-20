import { useContext } from "react";
import { RadioContext } from "../lib/radio-context";
export function useRadio() {
  const value = useContext(RadioContext);
  if (!value) throw new Error("O player precisa do RadioProvider.");
  return value;
}
