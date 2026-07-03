import { apiFetch } from "./client";

export const widgetsApi = {
  /** Fetch a widget's data (synced snapshot when authed, demo otherwise). */
  get: <T>(widgetId: string) => apiFetch<T>(`/api/v1/widgets/${widgetId}`),
  /** Trigger a background sync across all providers. */
  sync: () => apiFetch<{ queued: string[] }>("/api/v1/sync", { method: "POST" }),
};
