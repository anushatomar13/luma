/**
 * Appearance tokens the user picks during onboarding. Luma stays dark-only; the
 * customizable axes are the brand accent (gradient endpoints) and corner style.
 * These are applied to the document root at runtime by <AppearanceProvider>.
 */

export type AccentKey =
  | "violet"
  | "cyan"
  | "emerald"
  | "rose"
  | "amber"
  | "blue";

export interface Accent {
  key: AccentKey;
  label: string;
  /** Primary gradient endpoint (maps to --brand). */
  brand: string;
  /** Secondary gradient endpoint (maps to --brand-2). */
  brand2: string;
}

export const ACCENTS: Accent[] = [
  { key: "violet", label: "Violet", brand: "oklch(0.65 0.2 280)", brand2: "oklch(0.72 0.15 210)" },
  { key: "cyan", label: "Cyan", brand: "oklch(0.7 0.14 205)", brand2: "oklch(0.75 0.15 160)" },
  { key: "emerald", label: "Emerald", brand: "oklch(0.72 0.16 160)", brand2: "oklch(0.76 0.14 190)" },
  { key: "rose", label: "Rose", brand: "oklch(0.66 0.21 10)", brand2: "oklch(0.7 0.18 340)" },
  { key: "amber", label: "Amber", brand: "oklch(0.78 0.16 70)", brand2: "oklch(0.72 0.17 40)" },
  { key: "blue", label: "Blue", brand: "oklch(0.62 0.2 265)", brand2: "oklch(0.72 0.16 230)" },
];

export const DEFAULT_ACCENT: AccentKey = "violet";

export function getAccent(key: AccentKey): Accent {
  return ACCENTS.find((a) => a.key === key) ?? ACCENTS[0];
}

export type CornerStyle = "soft" | "sharp";

export const CORNER_RADIUS: Record<CornerStyle, string> = {
  soft: "0.875rem",
  sharp: "0.35rem",
};

export const DEFAULT_CORNER: CornerStyle = "soft";
