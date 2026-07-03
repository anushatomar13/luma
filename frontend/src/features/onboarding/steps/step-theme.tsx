"use client";

import { Check } from "lucide-react";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { ACCENTS, type CornerStyle } from "@/lib/theme/appearance";
import { cn } from "@/lib/utils";

const CORNERS: { key: CornerStyle; label: string; radius: string }[] = [
  { key: "soft", label: "Soft", radius: "1rem" },
  { key: "sharp", label: "Sharp", radius: "0.35rem" },
];

export function StepTheme() {
  const accent = usePreferencesStore((s) => s.accent);
  const setAccent = usePreferencesStore((s) => s.setAccent);
  const corner = usePreferencesStore((s) => s.corner);
  const setCorner = usePreferencesStore((s) => s.setCorner);

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Accent color
        </p>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              type="button"
              aria-label={a.label}
              aria-pressed={accent === a.key}
              onClick={() => setAccent(a.key)}
              className={cn(
                "flex size-11 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-black transition-transform hover:scale-105",
                accent === a.key ? "ring-white/80" : "ring-transparent",
              )}
              style={{
                backgroundImage: `linear-gradient(135deg, ${a.brand}, ${a.brand2})`,
              }}
            >
              {accent === a.key && <Check className="size-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Widget style
        </p>
        <div className="flex gap-3">
          {CORNERS.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={corner === c.key}
              onClick={() => setCorner(c.key)}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 border p-4 transition-colors",
                corner === c.key
                  ? "border-brand/50 bg-brand/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
              )}
              style={{ borderRadius: c.radius }}
            >
              <span
                className="h-10 w-full bg-white/10"
                style={{ borderRadius: c.radius }}
              />
              <span className="text-sm text-foreground">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </p>
        <div className="glass flex items-center justify-between rounded-2xl p-4">
          <div>
            <p className="text-gradient-brand text-2xl font-semibold">Luma</p>
            <p className="text-sm text-muted-foreground">Your accent, live.</p>
          </div>
          <span
            className="rounded-full px-3 py-1.5 text-sm font-medium text-white"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))",
            }}
          >
            Aa
          </span>
        </div>
      </div>
    </div>
  );
}
