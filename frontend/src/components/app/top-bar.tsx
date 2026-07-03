import Link from "next/link";
import { Search } from "lucide-react";
import { UserMenu } from "./user-menu";

/**
 * Global glass top bar. The search field is a placeholder until the
 * natural-language search lands (Phase 7).
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-gradient-brand text-xl font-semibold tracking-tight"
        >
          Luma
        </Link>

        <button
          type="button"
          className="ml-auto flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] sm:min-w-64"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search your life…</span>
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
