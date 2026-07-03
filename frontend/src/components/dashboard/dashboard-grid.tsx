"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import type { DashboardLayoutItem } from "@/lib/widget-sdk";
import { SortableWidget } from "./sortable-widget";

/**
 * The layout engine. Reads the layout from the dashboard store and renders each
 * widget responsively; in edit mode, widgets can be dragged to reorder. It has
 * zero knowledge of what any individual widget is — everything comes from the
 * registry via `SortableWidget`.
 */
export function DashboardGrid({ layout }: { layout: DashboardLayoutItem[] }) {
  const reorder = useDashboardStore((s) => s.reorder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const ids = layout.map((item) => item.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorder(from, to);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {layout.map((item, index) => (
            <SortableWidget key={item.id} item={item} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
