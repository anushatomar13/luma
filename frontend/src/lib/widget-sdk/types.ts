import type { ComponentType } from "react";

/**
 * Widget SDK — the plugin contract every Luma widget implements.
 *
 * The dashboard is a layout engine that knows nothing about individual widgets;
 * it only understands this contract. Adding a new data source (GitHub, Goodreads,
 * Apple Health…) means implementing a `WidgetDefinition` and registering it —
 * never editing the dashboard.
 */

/** Grid footprint a widget can occupy. Mapped to column/row spans by the layout engine. */
export type WidgetSize = "sm" | "md" | "lg" | "wide" | "tall";

/** Grouping used by the (future) widget picker. */
export type WidgetCategory =
  | "today"
  | "music"
  | "memories"
  | "activity"
  | "growth"
  | "travel"
  | "inspiration";

/** Static description of a widget — the "plugin manifest". */
export interface WidgetManifest {
  /** Stable unique id, e.g. "spotify", "today", "life-pulse". */
  id: string;
  /** Display name shown in the picker and card header. */
  title: string;
  /** One-line description for the picker. */
  description: string;
  /** Icon component (e.g. a lucide-react icon). */
  icon: ComponentType<{ className?: string }>;
  /** Grouping in the picker. */
  category: WidgetCategory;
  /** Sizes this widget supports. */
  supportedSizes: WidgetSize[];
  /** Default size when first added to a dashboard. */
  defaultSize: WidgetSize;
  /** If set, the widget needs this integration connected (e.g. "spotify"). */
  requiresConnection?: string;
}

/** Props passed to every widget renderer. */
export interface WidgetRenderProps<TData = unknown> {
  /** The widget's resolved data (never undefined — the host shows a skeleton while loading). */
  data: TData;
  /** The size the widget is currently rendered at, so renderers can adapt layout. */
  size: WidgetSize;
}

/**
 * A widget's data source. In Phase 1 this returns mock data synchronously;
 * from Phase 4 it calls the widget's backend sync service.
 */
export type WidgetDataSource<TData = unknown> = () => Promise<TData> | TData;

/** Full widget definition = manifest + renderer + data source. The plugin interface. */
export interface WidgetDefinition<TData = unknown> {
  manifest: WidgetManifest;
  /** React component that renders the widget body inside the card shell. */
  render: ComponentType<WidgetRenderProps<TData>>;
  /** Resolves the widget's data (mock now, backend later). */
  getData: WidgetDataSource<TData>;
}

/**
 * Authoring helper. Keeps full type-safety at the widget boundary (renderer and
 * getData are checked against `TData`), then type-erases to `WidgetDefinition` so
 * heterogeneous widgets can live together in one registry and layout.
 */
export function defineWidget<TData>(
  def: WidgetDefinition<TData>,
): WidgetDefinition {
  return def as unknown as WidgetDefinition;
}

/** One entry in a dashboard layout: which widget, at what size. */
export interface DashboardLayoutItem {
  /** Stable unique instance id (allows the same widget to appear more than once). */
  id: string;
  widgetId: string;
  size: WidgetSize;
}
