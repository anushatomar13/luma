"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useMounted } from "@/lib/hooks/use-mounted";

export function UserMenu() {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Neutral placeholder on the server / first paint to avoid a hydration flip.
  if (!mounted) {
    return <div className="size-9 shrink-0 rounded-full bg-white/5" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={logout}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))",
        }}
        title={user.name || user.email}
      >
        {initial}
      </div>
    </div>
  );
}
