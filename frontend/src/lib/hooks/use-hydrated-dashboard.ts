"use client";

import { useSyncExternalStore } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";

/**
 * Reports whether the persisted dashboard layout has finished rehydrating.
 *
 * `useSyncExternalStore` guarantees the server render and the first client
 * (hydration) render both see `false` — so callers render the default layout on
 * both, avoiding a mismatch — then flip to the persisted layout once hydration
 * completes. Rehydration itself is kicked off as a client-side side effect in
 * the store module.
 */
function subscribe(callback: () => void) {
  const unsubscribe = useDashboardStore.persist.onFinishHydration(callback);
  // If hydration already finished before this subscription, notify immediately.
  if (useDashboardStore.persist.hasHydrated()) callback();
  return unsubscribe;
}

export function useHydratedDashboard() {
  return useSyncExternalStore(
    subscribe,
    () => useDashboardStore.persist.hasHydrated(),
    () => false,
  );
}
