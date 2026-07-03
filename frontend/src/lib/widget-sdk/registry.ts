import type { WidgetDefinition } from "./types";

/**
 * The widget registry — the plugin mechanism at the heart of Luma.
 *
 * Widgets register themselves here; the dashboard looks them up by id. This is
 * what lets the layout engine stay completely decoupled from any specific widget.
 */
class WidgetRegistry {
  private readonly widgets = new Map<string, WidgetDefinition>();

  /** Register a single widget. Later registration of the same id overwrites (with a warning). */
  register(def: WidgetDefinition): this {
    if (this.widgets.has(def.manifest.id)) {
      console.warn(
        `[widget-sdk] Widget "${def.manifest.id}" is already registered; overwriting.`,
      );
    }
    this.widgets.set(def.manifest.id, def);
    return this;
  }

  /** Register many widgets at once. */
  registerAll(defs: WidgetDefinition[]): this {
    defs.forEach((def) => this.register(def));
    return this;
  }

  /** Look up a widget definition by id. */
  get(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  /** Whether a widget id is registered. */
  has(id: string): boolean {
    return this.widgets.has(id);
  }

  /** All registered widgets (e.g. for the picker). */
  all(): WidgetDefinition[] {
    return [...this.widgets.values()];
  }
}

/** App-wide singleton registry. */
export const widgetRegistry = new WidgetRegistry();
