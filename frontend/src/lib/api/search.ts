import { apiFetch } from "./client";

export interface SearchResult {
  widget_id: string;
  text: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export const searchApi = {
  query: (q: string, kind?: string) =>
    apiFetch<SearchResponse>(
      `/api/v1/search?q=${encodeURIComponent(q)}${kind ? `&kind=${kind}` : ""}`,
    ),
};
