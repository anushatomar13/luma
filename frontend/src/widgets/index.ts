import { widgetRegistry, type DashboardLayoutItem } from "@/lib/widget-sdk";
import { todayWidget } from "./today";
import { growthWidget } from "./growth";
import { quoteWidget } from "./quote";

/**
 * The widget catalog. Importing this module registers every widget as a side
 * effect, so anything that renders the dashboard just needs to import from here.
 * Adding a new widget = create its module and add it to this array.
 */
export const widgets = [todayWidget, growthWidget, quoteWidget];

widgetRegistry.registerAll(widgets);

/** The default dashboard shown before per-user layouts exist (Phase 2+). */
export const defaultLayout: DashboardLayoutItem[] = [
  { widgetId: "today", size: "md" },
  { widgetId: "growth", size: "md" },
  { widgetId: "quote", size: "wide" },
];
