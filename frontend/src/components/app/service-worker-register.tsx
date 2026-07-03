"use client";

import { useEffect } from "react";

/** Registers the service worker so Luma is installable and works offline. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal.
      });
    }
  }, []);

  return null;
}
