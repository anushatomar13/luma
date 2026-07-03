import { Sparkles } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";
import { widgetsApi } from "@/lib/api/widgets";

interface TodayData {
  greeting: string;
  dateLabel: string;
  weather: string;
  nextEvent: string;
  nowPlaying: string;
}

function TodayRenderer({ data }: WidgetRenderProps<TodayData>) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-2xl font-semibold text-foreground">{data.greeting}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{data.dateLabel}</p>
      </div>
      <dl className="grid grid-cols-3 gap-3 text-sm">
        <Stat label="Weather" value={data.weather} />
        <Stat label="Next up" value={data.nextEvent} />
        <Stat label="Playing" value={data.nowPlaying} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-foreground">{value}</dd>
    </div>
  );
}

export const todayWidget = defineWidget<TodayData>({
  manifest: {
    id: "today",
    title: "Today",
    description: "Your day at a glance — weather, next event, and what's playing.",
    icon: Sparkles,
    category: "today",
    supportedSizes: ["md", "wide"],
    defaultSize: "md",
  },
  render: TodayRenderer,
  getData: async (): Promise<TodayData> => {
    try {
      return await widgetsApi.get<TodayData>("today");
    } catch {
      return {
        greeting: "Good evening, Anusha",
        dateLabel: "Friday · July 3",
        weather: "28° Clear",
        nextEvent: "Design review · 5:30",
        nowPlaying: "Midnight City — M83",
      };
    }
  },
});
