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
    void resource.refresh();
    // O cliente respeita o TTL; este tick também permite reavaliar após falhas sem loops agressivos.
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void resource.refresh();
    }, 60000);
    return () => clearInterval(timer);
  }, [resource]);
  return snapshot;
}
