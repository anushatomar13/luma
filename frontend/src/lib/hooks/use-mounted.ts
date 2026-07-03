"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first (hydration) client render, then true.
 * Uses useSyncExternalStore's server snapshot so it flips after mount without a
 * set-state-in-effect. Gate persisted-store reads on this to avoid mismatches.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
