import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_ACCENT,
  DEFAULT_CORNER,
  type AccentKey,
  type CornerStyle,
} from "@/lib/theme/appearance";

export interface Profile {
  name: string;
  dob: string;
  country: string;
  timezone: string;
}

export type ConnectionKey =
  | "spotify"
  | "googlePhotos"
  | "googleCalendar"
  | "location";

interface PreferencesState {
  profile: Profile;
  interests: string[];
  accent: AccentKey;
  corner: CornerStyle;
  connections: Record<ConnectionKey, boolean>;
  onboarded: boolean;

  setProfile: (patch: Partial<Profile>) => void;
  toggleInterest: (id: string) => void;
  setAccent: (accent: AccentKey) => void;
  setCorner: (corner: CornerStyle) => void;
  toggleConnection: (key: ConnectionKey) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialProfile: Profile = {
  name: "",
  dob: "",
  country: "",
  timezone: "",
};

const initialConnections: Record<ConnectionKey, boolean> = {
  spotify: false,
  googlePhotos: false,
  googleCalendar: false,
  location: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      interests: [],
      accent: DEFAULT_ACCENT,
      corner: DEFAULT_CORNER,
      connections: initialConnections,
      onboarded: false,

      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      toggleInterest: (id) =>
        set((s) => ({
          interests: s.interests.includes(id)
            ? s.interests.filter((i) => i !== id)
            : [...s.interests, id],
        })),

      setAccent: (accent) => set({ accent }),
      setCorner: (corner) => set({ corner }),

      toggleConnection: (key) =>
        set((s) => ({
          connections: { ...s.connections, [key]: !s.connections[key] },
        })),

      completeOnboarding: () => set({ onboarded: true }),

      resetOnboarding: () =>
        set({
          profile: initialProfile,
          interests: [],
          accent: DEFAULT_ACCENT,
          corner: DEFAULT_CORNER,
          connections: initialConnections,
          onboarded: false,
        }),
    }),
    { name: "luma-preferences", version: 1 },
  ),
);
