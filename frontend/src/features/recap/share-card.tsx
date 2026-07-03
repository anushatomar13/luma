import type { RecapSummary } from "@/lib/api/summaries";

export type CardVariant = "music" | "travel" | "recap";

const LABEL: Record<CardVariant, string> = {
  music: "Music DNA",
  travel: "Top Place",
  recap: "Your Recap",
};

const BG: Record<CardVariant, string> = {
  music: "linear-gradient(160deg, oklch(0.52 0.2 300), oklch(0.12 0.03 300) 78%)",
  travel: "linear-gradient(160deg, oklch(0.52 0.15 210), oklch(0.12 0.03 220) 78%)",
  recap: "linear-gradient(160deg, oklch(0.52 0.18 340), oklch(0.12 0.03 285) 78%)",
};

export function ShareCard({
  variant,
  summary,
}: {
  variant: CardVariant;
  summary: RecapSummary;
}) {
  return (
    <div
      className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-3xl p-6 text-white"
      style={{ backgroundImage: BG[variant] }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
          {LABEL[variant]}
        </span>
        <span className="text-sm font-semibold">Luma</span>
      </div>

      <div className="py-4">
        {variant === "music" && (
          <>
            <p className="text-sm text-white/60">On repeat this week</p>
            <p className="mt-3 text-4xl font-semibold leading-[1.05]">
              {summary.topSong.track}
            </p>
            <p className="mt-2 text-xl text-white/80">{summary.topSong.artist}</p>
          </>
        )}

        {variant === "travel" && (
          <>
            <p className="text-sm text-white/60">Where you wandered</p>
            <p className="mt-3 text-5xl font-semibold leading-none">
              {summary.topPlace.place}
            </p>
            <p className="mt-2 text-xl text-white/80">
              {summary.topPlace.country}
            </p>
            <p className="mt-4 text-sm text-white/60">
              {summary.topPlace.distanceKm.toLocaleString()} km travelled
            </p>
          </>
        )}

        {variant === "recap" && (
          <>
            <p className="text-2xl font-semibold leading-tight">
              {summary.headline}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/80">
              <li>♫ {summary.topSong.track} — {summary.topSong.artist}</li>
              <li>✈ {summary.topPlace.place}, {summary.topPlace.country}</li>
              <li>◷ {summary.bestMemory}</li>
            </ul>
          </>
        )}
      </div>

      <p className="text-[11px] text-white/50">{summary.rangeLabel} · luma.app</p>
    </div>
  );
}
