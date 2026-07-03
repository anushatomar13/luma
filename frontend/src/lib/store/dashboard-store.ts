import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { widgetRegistry, type DashboardLayoutItem } from "@/lib/widget-sdk";
import { defaultLayout } from "@/widgets";

interface DashboardState {
  layout: DashboardLayoutItem[];
  /** Edit mode: shows drag handles, resize, and remove controls. */
  editing: boolean;
  toggleEditing: () => void;
  setEditing: (value: boolean) => void;
  /** Reorder via drag-and-drop indices. */
  reorder: (from: number, to: number) => void;
  /** Append a widget at its default size. */
  addWidget: (widgetId: string) => void;
  removeWidget: (id: string) => void;
  /** Cycle a widget through its supported sizes. */
  cycleSize: (id: string) => void;
  resetLayout: () => void;
}

function newInstanceId(widgetId: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${widgetId}-${suffix}`;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: defaultLayout,
      editing: false,

      toggleEditing: () => set((s) => ({ editing: !s.editing })),
      setEditing: (value) => set({ editing: value }),

      reorder: (from, to) =>
        set((s) => ({ layout: arrayMove(s.layout, from, to) })),

      addWidget: (widgetId) => {
        const def = widgetRegistry.get(widgetId);
        if (!def) return;
        set((s) => ({
          layout: [
            ...s.layout,
            {
              id: newInstanceId(widgetId),
              widgetId,
              size: def.manifest.defaultSize,
            },
          ],
        }));
      },

      removeWidget: (id) =>
        set((s) => ({ layout: s.layout.filter((item) => item.id !== id) })),

      cycleSize: (id) =>
        set((s) => ({
          layout: s.layout.map((item) => {
            if (item.id !== id) return item;
            const sizes = widgetRegistry.get(item.widgetId)?.manifest
              .supportedSizes;
            if (!sizes || sizes.length < 2) return item;
            const next = sizes[(sizes.indexOf(item.size) + 1) % sizes.length];
            return { ...item, size: next };
          }),
        })),

      resetLayout: () => set({ layout: defaultLayout, editing: false }),
    }),
    {
      name: "luma-dashboard",
      version: 1,
      // Rehydration is triggered on the client below (not automatically) so the
      // server-rendered default layout matches the first client paint; callers
      // gate on `useHydratedDashboard` before showing the persisted layout.
      skipHydration: true,
      partialize: (s) => ({ layout: s.layout }),
    },
  ),
);

// Kick off rehydration once, on the client only.
if (typeof window !== "undefined") {
  void useDashboardStore.persist.rehydrate();
}
