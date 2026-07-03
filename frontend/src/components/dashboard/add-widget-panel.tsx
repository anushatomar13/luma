"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { widgetRegistry, type WidgetCategory } from "@/lib/widget-sdk";
import { useDashboardStore } from "@/lib/store/dashboard-store";

const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  today: "Today",
  music: "Music",
  memories: "Memories",
  activity: "Activity",
  growth: "Growth",
  travel: "Travel",
  inspiration: "Inspiration",
};

export function AddWidgetPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const layout = useDashboardStore((s) => s.layout);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Group registered widgets by category for the picker.
  const grouped = widgetRegistry.all().reduce<
    Record<string, ReturnType<typeof widgetRegistry.all>>
  >((acc, def) => {
    (acc[def.manifest.category] ??= []).push(def);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="glass absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Add a widget"
          >
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Add a widget
                </h2>
                <p className="text-sm text-muted-foreground">
                  Everything is a pluggable module.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="-mr-2 flex-1 space-y-5 overflow-y-auto pr-2">
              {Object.entries(grouped).map(([category, defs]) => (
                <section key={category}>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                    {CATEGORY_LABELS[category as WidgetCategory] ?? category}
                  </h3>
                  <ul className="space-y-2">
                    {defs.map((def) => {
                      const Icon = def.manifest.icon;
                      const count = layout.filter(
                        (i) => i.widgetId === def.manifest.id,
                      ).length;
                      return (
                        <li key={def.manifest.id}>
                          <button
                            type="button"
                            onClick={() => addWidget(def.manifest.id)}
                            className="group flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-left transition-colors hover:border-white/15 hover:bg-white/[0.06]"
                          >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand">
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                                {def.manifest.title}
                                {count > 0 && (
                                  <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] text-brand">
                                    {count} added
                                  </span>
                                )}
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {def.manifest.description}
                              </span>
                            </span>
                            <Plus className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
