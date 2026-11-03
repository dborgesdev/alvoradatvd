import { useEffect, useSyncExternalStore } from "react";
type Resource<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  refresh: () => Promise<void>;
};
export function useService<T>(resource: Resource<T>) {
  const snapshot = useSyncExternalStore(
    resource.subscribe,
    resource.getSnapshot,
  );
  useEffect(() => {
    const refreshVisible = () => {
      if (document.visibilityState === "visible") void resource.refresh();
    };
    void resource.refresh();
    // O cliente respeita o TTL; este tick também permite reavaliar após falhas sem loops agressivos.
    const timer = setInterval(refreshVisible, 60000);
    document.addEventListener("visibilitychange", refreshVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, [resource]);
  return snapshot;
}
