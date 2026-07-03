"use client";

import { useQuery } from "@tanstack/react-query";
import {
  widgetRegistry,
  type DashboardLayoutItem,
  type WidgetSize,
} from "@/lib/widget-sdk";
import { defaultLayout } from "@/widgets";
import { WidgetCard } from "./widget-card";

/**
 * Maps each widget size to responsive grid spans. These are *static* strings so
 * Tailwind's compiler can see them. Base (mobile) = single column feed; `sm` =
 * 2-col; `lg` = 4-col desktop grid.
 */
const sizeClasses: Record<WidgetSize, string> = {
  sm: "sm:col-span-1 sm:row-span-1",
  md: "sm:col-span-2 sm:row-span-1",
  lg: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2 lg:col-span-4 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
};

/**
 * The layout engine. Given a layout (list of widget id + size), it looks each
 * widget up in the registry and renders it responsively. It has zero knowledge
 * of what any individual widget is.
 */
export function DashboardGrid({
  layout = defaultLayout,
}: {
  layout?: DashboardLayoutItem[];
}) {
  return (
    <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      {layout.map((item, index) => (
        <WidgetHost key={`${item.widgetId}-${index}`} item={item} index={index} />
      ))}
    </div>
  );
}

/** Renders one widget: resolves its data, then hands it to the widget's renderer. */
function WidgetHost({
  item,
  index,
}: {
  item: DashboardLayoutItem;
  index: number;
}) {
  const def = widgetRegistry.get(item.widgetId);

  const { data, isLoading } = useQuery({
    queryKey: ["widget", item.widgetId],
    queryFn: () => def!.getData(),
    enabled: Boolean(def),
  });

  if (!def) {
    return (
      <div className={sizeClasses[item.size]}>
        <div className="glass flex h-full items-center justify-center rounded-3xl p-5 text-sm text-muted-foreground">
          Unknown widget: {item.widgetId}
        </div>
      </div>
    );
  }

  const Renderer = def.render;

  return (
    <div className={sizeClasses[item.size]}>
      <WidgetCard
        title={def.manifest.title}
        icon={def.manifest.icon}
        index={index}
        isLoading={isLoading || data === undefined}
      >
        {data !== undefined ? <Renderer data={data} size={item.size} /> : null}
      </WidgetCard>
    </div>
  );
}
