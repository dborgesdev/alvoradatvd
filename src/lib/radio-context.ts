import { createContext } from "react";
import type { useRadioPlayer } from "../hooks/useRadioPlayer";
export type RadioContextValue = Omit<
  ReturnType<typeof useRadioPlayer>,
  "ref"
>;
export const RadioContext = createContext<RadioContextValue | null>(null);
