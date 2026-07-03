"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface PulsePoint {
  day: string;
  value: number;
}

/** The Recharts area chart, split into its own chunk so recharts is only loaded
 * when a Life Pulse widget is actually rendered (keeps the dashboard bundle lean). */
export default function LifePulseChart({ series }: { series: PulsePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={series} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="pulse-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--brand)"
          strokeWidth={2.5}
          fill="url(#pulse-fill)"
          isAnimationActive
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
