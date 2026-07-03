"use client";

import { Activity, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface PulsePoint {
  day: string;
  value: number;
}

interface LifePulseData {
  /** Current activity index (NOT happiness — a composite of calendar, photos, music, travel). */
  current: number;
  deltaPct: number;
  series: PulsePoint[];
}

function LifePulseRenderer({ data }: WidgetRenderProps<LifePulseData>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {data.current}
          </p>
          <p className="text-xs text-muted-foreground">
            Activity index · this week
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-2 py-1 text-xs font-medium text-brand">
          <ArrowUpRight className="size-3" />
          {data.deltaPct}%
        </span>
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.series}
            margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
          >
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
      </div>
    </div>
  );
}

export const lifePulseWidget = defineWidget<LifePulseData>({
  manifest: {
    id: "life-pulse",
    title: "Life Pulse",
    description: "A personal activity index across everything you do.",
    icon: Activity,
    category: "activity",
    supportedSizes: ["lg", "wide"],
    defaultSize: "lg",
  },
  render: LifePulseRenderer,
  getData: () => ({
    current: 78,
    deltaPct: 12,
    series: [
      { day: "Mon", value: 42 },
      { day: "Tue", value: 55 },
      { day: "Wed", value: 48 },
      { day: "Thu", value: 63 },
      { day: "Fri", value: 71 },
      { day: "Sat", value: 66 },
      { day: "Sun", value: 78 },
      { day: "Mon", value: 74 },
      { day: "Tue", value: 82 },
      { day: "Wed", value: 79 },
      { day: "Thu", value: 88 },
      { day: "Fri", value: 84 },
    ],
  }),
});
