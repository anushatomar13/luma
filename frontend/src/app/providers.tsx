"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppearanceProvider } from "@/components/app/appearance-provider";
import { CommandPalette } from "@/features/search/command-palette";

/**
 * App-wide client providers. Kept in one place so `layout.tsx` stays a
 * server component and we mount the QueryClient once per browser session.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppearanceProvider />
        {children}
        <CommandPalette />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
