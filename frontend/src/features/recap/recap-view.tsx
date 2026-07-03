"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { summariesApi, type RecapSummary } from "@/lib/api/summaries";
import { ShareCard, type CardVariant } from "./share-card";

const DEMO: RecapSummary = {
  period: "weekly",
  rangeLabel: "This week",
  headline: "this week, M83 was on repeat and Goa was on your mind.",
  topSong: { track: "Midnight City", artist: "M83" },
  topPlace: { place: "Goa", country: "India", distanceKm: 1487 },
  bestMemory: "Sunset in Goa",
  insights: [],
};

const CARDS: CardVariant[] = ["recap", "music", "travel"];

export function RecapView() {
  const { data } = useQuery({
    queryKey: ["summary", "weekly"],
    queryFn: () => summariesApi.get("weekly"),
    retry: false,
  });
  const summary = data ?? DEMO;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">{summary.rangeLabel}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your recap
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Beautiful, shareable cards from your week. Download and post to Stories.
        </p>
      </header>

      <div className="flex snap-x gap-5 overflow-x-auto pb-4">
        {CARDS.map((variant) => (
          <RecapCard key={variant} variant={variant} summary={summary} />
        ))}
      </div>
    </main>
  );
}

function RecapCard({
  variant,
  summary,
}: {
  variant: CardVariant;
  summary: RecapSummary;
}) {
  const ref = useRef<HTMLDivElement>(null);

  async function download() {
    if (!ref.current) return;
    const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement("a");
    link.href = url;
    link.download = `luma-${variant}.png`;
    link.click();
  }

  return (
    <div className="w-64 shrink-0 snap-start">
      <div ref={ref}>
        <ShareCard variant={variant} summary={summary} />
      </div>
      <button
        type="button"
        onClick={download}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
      >
        <Download className="size-4" />
        Download
      </button>
    </div>
  );
}
