"use client";

import {
  CalendarDays,
  Check,
  Disc3,
  ImageIcon,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import {
  usePreferencesStore,
  type ConnectionKey,
} from "@/lib/store/preferences-store";
import { cn } from "@/lib/utils";

const CONNECTIONS: {
  key: ConnectionKey;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  { key: "spotify", label: "Spotify", description: "Music, taste & listening history", icon: Disc3 },
  { key: "googlePhotos", label: "Google Photos", description: "Memories and moments", icon: ImageIcon },
  { key: "googleCalendar", label: "Google Calendar", description: "Events and your day", icon: CalendarDays },
  { key: "location", label: "Location", description: "Travel and places you've been", icon: MapPin },
];

export function StepConnections() {
  const connections = usePreferencesStore((s) => s.connections);
  const toggleConnection = usePreferencesStore((s) => s.toggleConnection);

  return (
    <div className="space-y-3">
      {CONNECTIONS.map(({ key, label, description, icon: Icon }) => {
        const connected = connections[key];
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleConnection(key)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
                connected
                  ? "border-brand/40 bg-brand/15 text-brand"
                  : "border-white/10 bg-white/[0.03] text-foreground hover:bg-white/[0.06]",
              )}
            >
              {connected ? (
                <>
                  <Check className="size-3.5" />
                  Connected
                </>
              ) : (
                "Connect"
              )}
            </button>
          </div>
        );
      })}
      <p className="pt-1 text-center text-xs text-muted-foreground">
        You can connect these anytime — skip for now if you like.
      </p>
    </div>
  );
}
