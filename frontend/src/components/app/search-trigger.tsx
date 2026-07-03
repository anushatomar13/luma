"use client";

import { Search } from "lucide-react";
import { useSearchStore } from "@/lib/store/search-store";

export function SearchTrigger() {
  const setOpen = useSearchStore((s) => s.setOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="ml-auto flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] sm:min-w-64"
    >
      <Search className="size-4" />
      <span className="hidden sm:inline">Search your life…</span>
      <kbd className="ml-auto hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
