import { widgetRegistry, type DashboardLayoutItem } from "@/lib/widget-sdk";
import { spotifyWidget } from "./spotify";
import { lifePulseWidget } from "./life-pulse";
import { memoryWidget } from "./memory";
import { travelWidget } from "./travel";
import { tasteWidget } from "./taste";
import { todayWidget } from "./today";
import { growthWidget } from "./growth";
import { quoteWidget } from "./quote";

/**
 * The widget catalog. Importing this module registers every widget as a side
 * effect, so anything that renders the dashboard just needs to import from here.
 * Adding a new widget = create its module and add it to this array.
 */
export const widgets = [
  spotifyWidget,
  lifePulseWidget,
  memoryWidget,
  travelWidget,
  tasteWidget,
  todayWidget,
  growthWidget,
  quoteWidget,
];

widgetRegistry.registerAll(widgets);

/**
 * The default dashboard shown before a user customizes their own (persisted in
 * the dashboard store). Ids are stable so drag-and-drop keys survive reloads.
 */
export const defaultLayout: DashboardLayoutItem[] = [
  { id: "d-spotify", widgetId: "spotify", size: "lg" },
  { id: "d-life-pulse", widgetId: "life-pulse", size: "lg" },
  { id: "d-memory", widgetId: "memory", size: "lg" },
  { id: "d-travel", widgetId: "travel", size: "lg" },
  { id: "d-today", widgetId: "today", size: "md" },
  { id: "d-growth", widgetId: "growth", size: "md" },
  { id: "d-taste", widgetId: "taste", size: "md" },
  { id: "d-quote", widgetId: "quote", size: "wide" },
];
