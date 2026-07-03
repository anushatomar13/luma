"use client";

import { motion } from "motion/react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  /** Position in the grid, used to stagger the entrance animation. */
  index?: number;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The floating glass shell every widget renders inside. Owns the chrome
 * (header, padding, radius, shadow) and the entrance + hover micro-interactions,
 * so individual widgets only worry about their content.
 */
export function WidgetCard({
  title,
  icon: Icon,
  index = 0,
  isLoading = false,
  className,
  children,
}: WidgetCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        "glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-5",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_24px_48px_-28px_rgba(0,0,0,0.85)]",
        "transition-colors hover:border-white/15",
        className,
      )}
    >
      <header className="mb-3 flex items-center gap-2 text-muted-foreground">
        {Icon ? <Icon className="size-4" /> : null}
        <h3 className="text-xs font-medium uppercase tracking-wider">{title}</h3>
      </header>
      <div className="min-h-0 flex-1">
        {isLoading ? <WidgetSkeleton /> : children}
      </div>
    </motion.section>
  );
}

function WidgetSkeleton() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="h-6 w-2/3 animate-pulse rounded-lg bg-white/5" />
      <div className="h-4 w-1/2 animate-pulse rounded-lg bg-white/5" />
      <div className="h-4 w-1/3 animate-pulse rounded-lg bg-white/5" />
    </div>
  );
}
