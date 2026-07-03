import { TrendingUp } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface GrowthStat {
  label: string;
  value: string;
}

interface GrowthData {
  stats: GrowthStat[];
}

function GrowthRenderer({ data }: WidgetRenderProps<GrowthData>) {
  return (
    <div className="grid h-full grid-cols-2 gap-x-4 gap-y-2">
      {data.stats.map((stat) => (
        <div key={stat.label} className="flex flex-col justify-center">
          <span className="text-gradient-brand text-2xl font-semibold tracking-tight">
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export const growthWidget = defineWidget<GrowthData>({
  manifest: {
    id: "growth",
    title: "Growth",
    description: "Milestones across your life — places, photos, artists, trips.",
    icon: TrendingUp,
    category: "growth",
    supportedSizes: ["md", "lg"],
    defaultSize: "md",
  },
  render: GrowthRenderer,
  getData: () => ({
    stats: [
      { label: "Cities visited", value: "14" },
      { label: "Photos taken", value: "3,481" },
      { label: "Artists discovered", value: "212" },
      { label: "Trips", value: "7" },
    ],
  }),
});
