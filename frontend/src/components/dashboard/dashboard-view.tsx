"use client";

import { useState, type ComponentProps } from "react";
import { Check, Pencil, Plus, RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useHydratedDashboard } from "@/lib/hooks/use-hydrated-dashboard";
import { defaultLayout } from "@/widgets";
import { cn } from "@/lib/utils";
import { DashboardGrid } from "./dashboard-grid";
import { EmptyState } from "./empty-state";
import { AddWidgetPanel } from "./add-widget-panel";

export function DashboardView() {
  const hydrated = useHydratedDashboard();

  const storeLayout = useDashboardStore((s) => s.layout);
  const toggleEditing = useDashboardStore((s) => s.toggleEditing);
  const resetLayout = useDashboardStore((s) => s.resetLayout);
  const editing = useDashboardStore((s) => s.editing);

  // Until the persisted layout has rehydrated, render the default so the server
  // and first client render agree.
  const layout = hydrated ? storeLayout : defaultLayout;

  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Friday · July 3</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {editing && (
            <ToolbarButton onClick={resetLayout}>
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Reset</span>
            </ToolbarButton>
          )}
          <ToolbarButton onClick={() => setPickerOpen(true)}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add widget</span>
          </ToolbarButton>
          <ToolbarButton onClick={toggleEditing} active={editing}>
            {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
            <span className="hidden sm:inline">{editing ? "Done" : "Edit"}</span>
          </ToolbarButton>
        </div>
      </header>

      {layout.length === 0 ? (
        <EmptyState onAdd={() => setPickerOpen(true)} />
      ) : (
        <DashboardGrid layout={layout} />
      )}

      <AddWidgetPanel open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </main>
  );
}

function ToolbarButton({
  children,
  active = false,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-foreground text-background hover:opacity-90"
          : "border-white/10 bg-white/[0.03] text-foreground hover:bg-white/[0.06]",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
