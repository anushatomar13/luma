"use client";

import { LayoutGrid, Plus } from "lucide-react";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-brand">
        <LayoutGrid className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Your dashboard is empty
      </h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Add a widget to start building the view of your life.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Add a widget
      </button>
    </div>
  );
}
