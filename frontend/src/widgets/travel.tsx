"use client";

import { MapPin, Plane } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface TravelData {
  place: string;
  country: string;
  distanceKm: number;
  daysSpent: number;
  weather: string;
}

/** Stylized faux map — real Mapbox previews arrive with the location integration (Phase 5). */
function FauxMap() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.2 0.03 260)" />
          <stop offset="100%" stopColor="oklch(0.14 0.02 280)" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill="url(#map-bg)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 25}
          y1="0"
          x2={i * 25}
          y2="120"
          stroke="oklch(1 0 0 / 0.05)"
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 24}
          x2="200"
          y2={i * 24}
          stroke="oklch(1 0 0 / 0.05)"
        />
      ))}
      <path
        d="M20 95 C 60 70, 90 100, 130 55 S 170 30, 182 28"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 5"
      />
      <circle cx="20" cy="95" r="3" fill="var(--brand-2)" />
    </svg>
  );
}

function TravelRenderer({ data }: WidgetRenderProps<TravelData>) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
        <FauxMap />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <MapPin className="size-6 fill-brand/30 text-brand drop-shadow" />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Plane className="size-3" />
          {data.place}, {data.country}
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <Stat label="Distance" value={`${data.distanceKm.toLocaleString()} km`} />
        <Stat label="Time" value={`${data.daysSpent} days`} />
        <Stat label="Weather" value={data.weather} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-foreground">{value}</dd>
    </div>
  );
}

export const travelWidget = defineWidget<TravelData>({
  manifest: {
    id: "travel",
    title: "Travel",
    description: "Your last trip — map, distance, and time spent.",
    icon: MapPin,
    category: "travel",
    supportedSizes: ["md", "lg"],
    defaultSize: "lg",
  },
  render: TravelRenderer,
  getData: () => ({
    place: "Goa",
    country: "India",
    distanceKm: 1487,
    daysSpent: 6,
    weather: "31° Sunny",
  }),
});
