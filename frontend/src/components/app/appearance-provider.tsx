"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { CORNER_RADIUS, getAccent } from "@/lib/theme/appearance";

/**
 * Applies the user's chosen accent + corner style to the document root as CSS
 * variables, so the whole app (dashboard included) reflects onboarding choices
 * live. Renders nothing.
 */
export function AppearanceProvider() {
  const accent = usePreferencesStore((s) => s.accent);
  const corner = usePreferencesStore((s) => s.corner);

  useEffect(() => {
    const { brand, brand2 } = getAccent(accent);
    const root = document.documentElement;
    root.style.setProperty("--brand", brand);
    root.style.setProperty("--brand-2", brand2);
    root.style.setProperty("--radius", CORNER_RADIUS[corner]);
  }, [accent, corner]);

  return null;
}
