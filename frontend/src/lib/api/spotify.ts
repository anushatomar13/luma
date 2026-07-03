import { apiFetch } from "./client";

export interface SpotifyWidgetResponse {
  track: string;
  artist: string;
  album: string;
  progress_sec: number;
  duration_sec: number;
  is_playing: boolean;
  is_live: boolean;
}

export const spotifyApi = {
  getWidget: () => apiFetch<SpotifyWidgetResponse>("/api/v1/spotify/widget"),
  status: () =>
    apiFetch<{ provider: string; connected: boolean }>("/api/v1/spotify/status"),
  connect: () => apiFetch<{ url: string }>("/api/v1/spotify/connect"),
};
