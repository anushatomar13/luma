"use client";

import { motion } from "motion/react";
import { Disc3 } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface SpotifyData {
  track: string;
  artist: string;
  album: string;
  progressSec: number;
  durationSec: number;
  isPlaying: boolean;
}

/** Fixed base heights (0–1) so SSR markup is deterministic; motion animates on top. */
const WAVE_BARS = [
  0.4, 0.7, 0.5, 0.9, 0.6, 0.35, 0.8, 0.55, 0.7, 1, 0.5, 0.65, 0.45, 0.85, 0.6,
  0.4, 0.75, 0.5, 0.9, 0.6, 0.45, 0.8, 0.5,
];

function formatTime(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SpotifyRenderer({ data }: WidgetRenderProps<SpotifyData>) {
  const pct = Math.min(100, (data.progressSec / data.durationSec) * 100);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="relative size-20 shrink-0 overflow-hidden rounded-2xl"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 15% 10%, oklch(0.72 0.2 300), transparent 55%), radial-gradient(120% 120% at 90% 95%, oklch(0.72 0.16 210), oklch(0.22 0.06 285))",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Disc3 className="size-7 text-white/85" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-foreground">
            {data.track}
          </p>
          <p className="truncate text-sm text-muted-foreground">{data.artist}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground/70">
            {data.album}
          </p>
        </div>
      </div>

      {/* Animated waveform */}
      <div
        className="flex min-h-0 flex-1 items-end justify-between gap-[3px]"
        aria-hidden
      >
        {WAVE_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-full origin-bottom rounded-full"
            style={{
              height: "100%",
              backgroundImage:
                "linear-gradient(to top, var(--brand), var(--brand-2))",
            }}
            initial={{ scaleY: h }}
            animate={
              data.isPlaying
                ? { scaleY: [h * 0.55, h, h * 0.7, h * 0.95, h * 0.6] }
                : { scaleY: h }
            }
            transition={{
              duration: 1.4 + (i % 5) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.04,
            }}
          />
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-foreground/80"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{formatTime(data.progressSec)}</span>
          <span>{formatTime(data.durationSec)}</span>
        </div>
      </div>
    </div>
  );
}

export const spotifyWidget = defineWidget<SpotifyData>({
  manifest: {
    id: "spotify",
    title: "Spotify",
    description: "What you're listening to right now, with a live waveform.",
    icon: Disc3,
    category: "music",
    supportedSizes: ["md", "lg", "tall"],
    defaultSize: "lg",
    requiresConnection: "spotify",
  },
  render: SpotifyRenderer,
  getData: () => ({
    track: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    progressSec: 154,
    durationSec: 241,
    isPlaying: true,
  }),
});
