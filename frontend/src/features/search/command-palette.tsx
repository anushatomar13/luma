"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Search } from "lucide-react";
import { searchApi, type SearchResult } from "@/lib/api/search";
import { useSearchStore } from "@/lib/store/search-store";
import { useAuthStore } from "@/lib/store/auth-store";

export function CommandPalette() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);
  const toggle = useSearchStore((s) => s.toggle);
  const isAuthed = useAuthStore((s) => Boolean(s.token));

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ⌘K / Ctrl+K to toggle, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, setOpen]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  function onChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const res = await searchApi.query(trimmed);
        setResults(res.results);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="glass relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Search your life"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4">
              {loading ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
              ) : (
                <Search className="size-4 shrink-0 text-muted-foreground" />
              )}
              <input
                autoFocus
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search your life…"
                className="h-14 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {!isAuthed ? (
                <Hint>Sign in and sync to search across your life.</Hint>
              ) : query.trim() && !loading && results.length === 0 ? (
                <Hint>No results for “{query}”.</Hint>
              ) : !query.trim() ? (
                <Hint>
                  Try “what was I listening to”, “Goa trip”, or “next event”.
                </Hint>
              ) : (
                <ul>
                  {results.map((r, i) => (
                    <li key={`${r.widget_id}-${i}`}>
                      <button
                        type="button"
                        onClick={close}
                        className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="mt-0.5 rounded-md bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand">
                          {r.widget_id}
                        </span>
                        <span className="min-w-0 flex-1 text-sm text-foreground">
                          {r.text}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
