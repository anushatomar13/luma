"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Disc3 } from "lucide-react";
import { spotifyApi } from "@/lib/api/spotify";
import { widgetsApi } from "@/lib/api/widgets";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * "Connect Spotify" pill (shown when signed in but not yet connected) plus the
 * handler for returning from Spotify's OAuth (`?spotify=connected`): it triggers
 * a sync so live data appears, then cleans the URL.
 */
export function SpotifyConnect() {
  const isAuthed = useAuthStore((s) => Boolean(s.token));
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: status } = useQuery({
    queryKey: ["spotify-status"],
    queryFn: spotifyApi.status,
    enabled: isAuthed,
    retry: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("spotify") !== "connected") return;
    window.history.replaceState({}, "", window.location.pathname);
    widgetsApi.sync().finally(() => {
      queryClient.invalidateQueries({ queryKey: ["widget"] });
      queryClient.invalidateQueries({ queryKey: ["spotify-status"] });
    });
  }, [queryClient]);

  if (!isAuthed || !status || status.connected) return null;

  async function connect() {
    setError(null);
    try {
      const { url } = await spotifyApi.connect();
      window.location.href = url;
    } catch {
      setError("Spotify isn't configured on the server yet.");
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error ? (
        <span className="text-xs text-muted-foreground">{error}</span>
      ) : (
        <button
          type="button"
          onClick={connect}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 text-sm font-medium text-brand transition-colors hover:bg-brand/20"
        >
          <Disc3 className="size-4" />
          <span className="hidden sm:inline">Connect Spotify</span>
        </button>
      )}
    </div>
  );
}
