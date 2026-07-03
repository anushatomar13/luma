"use client";

import { motion } from "motion/react";
import { Sparkle } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface TasteEntry {
  label: string;
  /** Share of listening/consumption, 0–100. */
  pct: number;
}

interface TasteData {
  heading: string;
  entries: TasteEntry[];
}

function TasteRenderer({ data }: WidgetRenderProps<TasteData>) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-sm text-muted-foreground">{data.heading}</p>
      <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center gap-2.5">
        {data.entries.map((entry, i) => (
          <div key={entry.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-sm text-foreground">
              {entry.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--brand), var(--brand-2))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${entry.pct}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {entry.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const tasteWidget = defineWidget<TasteData>({
  manifest: {
    id: "taste",
    title: "Taste",
    description: "How your taste in music and more is evolving.",
    icon: Sparkle,
    category: "music",
    supportedSizes: ["md", "lg"],
    defaultSize: "md",
  },
  render: TasteRenderer,
  getData: () => ({
    heading: "Top genres this season",
    entries: [
      { label: "Indie", pct: 82 },
      { label: "Electronic", pct: 64 },
      { label: "Lo-fi", pct: 47 },
      { label: "Jazz", pct: 33 },
    ],
  }),
});
