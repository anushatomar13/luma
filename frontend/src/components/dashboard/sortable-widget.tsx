"use client";

import type { ComponentProps } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { GripVertical, Scaling, X } from "lucide-react";
import {
  widgetRegistry,
  type DashboardLayoutItem,
  type WidgetSize,
} from "@/lib/widget-sdk";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { cn } from "@/lib/utils";
import { WidgetCard } from "./widget-card";

/** Size → responsive grid spans. Static strings so Tailwind can see them. */
export const sizeClasses: Record<WidgetSize, string> = {
  sm: "sm:col-span-1 sm:row-span-1",
  md: "sm:col-span-2 sm:row-span-1",
  lg: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2 lg:col-span-4 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
};

export function SortableWidget({
  item,
  index,
}: {
  item: DashboardLayoutItem;
  index: number;
}) {
  const editing = useDashboardStore((s) => s.editing);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const cycleSize = useDashboardStore((s) => s.cycleSize);

  const def = widgetRegistry.get(item.widgetId);

  const { data, isLoading } = useQuery({
    queryKey: ["widget", item.widgetId],
    queryFn: () => def!.getData(),
    enabled: Boolean(def),
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !editing });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (!def) {
    return (
      <div ref={setNodeRef} style={style} className={sizeClasses[item.size]}>
        <div className="glass flex h-full items-center justify-center rounded-3xl p-5 text-sm text-muted-foreground">
          Unknown widget: {item.widgetId}
        </div>
      </div>
    );
  }

  const Renderer = def.render;
  const supportsResize = def.manifest.supportedSizes.length > 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeClasses[item.size],
        "relative",
        isDragging && "z-20 opacity-80",
      )}
    >
      {editing && (
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1">
          {supportsResize && (
            <ControlButton label="Resize" onClick={() => cycleSize(item.id)}>
              <Scaling className="size-3.5" />
            </ControlButton>
          )}
          <ControlButton
            label="Drag to reorder"
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3.5" />
          </ControlButton>
          <ControlButton
            label="Remove"
            onClick={() => removeWidget(item.id)}
            className="hover:bg-destructive/25 hover:text-foreground"
          >
            <X className="size-3.5" />
          </ControlButton>
        </div>
      )}

      <WidgetCard
        title={def.manifest.title}
        icon={def.manifest.icon}
        index={index}
        isLoading={isLoading || data === undefined}
        disableHover={editing}
        className={cn(editing && "ring-1 ring-white/10")}
      >
        {data !== undefined ? <Renderer data={data} size={item.size} /> : null}
      </WidgetCard>
    </div>
  );
}

function ControlButton({
  children,
  label,
  className,
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/50 text-muted-foreground backdrop-blur transition-colors hover:bg-white/10 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
