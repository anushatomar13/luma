import Link from "next/link";
import { SearchTrigger } from "./search-trigger";
import { UserMenu } from "./user-menu";

/** Global glass top bar: brand, natural-language search trigger, user menu. */
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

        <SearchTrigger />

        <UserMenu />
      </div>
    </header>
  );
}
