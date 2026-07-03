import { apiFetch } from "./client";

export interface RecapSummary {
  period: string;
  rangeLabel: string;
  headline: string;
  topSong: { track: string; artist: string };
  topPlace: { place: string; country: string; distanceKm: number };
  bestMemory: string;
  insights: { title: string; body: string }[];
}

export const summariesApi = {
  get: (period: "weekly" | "monthly") =>
    apiFetch<RecapSummary>(`/api/v1/summaries/${period}`),
};
