"use client";

import {
  BookOpen,
  Camera,
  Code2,
  Dumbbell,
  Film,
  Landmark,
  Music,
  Plane,
  Shirt,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { cn } from "@/lib/utils";

const INTERESTS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "music", label: "Music", icon: Music },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "coding", label: "Coding", icon: Code2 },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "movies", label: "Movies", icon: Film },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "finance", label: "Finance", icon: Landmark },
  { id: "sports", label: "Sports", icon: Trophy },
];

export function StepInterests() {
  const interests = usePreferencesStore((s) => s.interests);
  const toggleInterest = usePreferencesStore((s) => s.toggleInterest);

  return (
    <div className="flex flex-wrap gap-2.5">
      {INTERESTS.map(({ id, label, icon: Icon }) => {
        const selected = interests.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleInterest(id)}
            aria-pressed={selected}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              selected
                ? "border-transparent bg-brand/20 text-foreground ring-1 ring-brand/50"
                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
            )}
          >
            <Icon
              className={cn("size-4", selected ? "text-brand" : "text-muted-foreground")}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
