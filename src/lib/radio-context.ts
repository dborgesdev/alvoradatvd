import { createContext } from "react";
import type { useRadioPlayer } from "../hooks/useRadioPlayer";
export type RadioContextValue = Omit<
  ReturnType<typeof useRadioPlayer>,
  "ref"
> & { isDemo: boolean };
export const RadioContext = createContext<RadioContextValue | null>(null);
