export type TvFailureKind = "network" | "media" | "unsupported" | "timeout";
export interface TvFailure {
  kind: TvFailureKind;
  message: string;
  detail?: string;
  httpStatus?: number;
}
export interface TvConnectionEvents {
  onAttached: () => void;
  onRecovering: (kind: "network" | "media") => void;
  onError: (failure: TvFailure) => void;
}
export interface TvConnection {
  destroy: () => void;
}
