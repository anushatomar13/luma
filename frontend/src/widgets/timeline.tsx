import { GitCommitVertical } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";
import { widgetsApi } from "@/lib/api/widgets";

interface TimelineEvent {
  time: string;
  title: string;
  kind: string;
}

interface TimelineData {
  events: TimelineEvent[];
}

const KIND_COLOR: Record<string, string> = {
  travel: "var(--brand-2)",
  music: "var(--brand)",
  memory: "var(--chart-3)",
  event: "var(--chart-4)",
};

function TimelineRenderer({ data }: WidgetRenderProps<TimelineData>) {
  return (
    <ol className="relative flex h-full flex-col gap-3 overflow-y-auto pl-4">
      <span className="absolute left-[3px] top-1 bottom-1 w-px bg-white/10" />
      {data.events.map((event, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-4 top-1.5 size-2 rounded-full ring-2 ring-background"
            style={{ background: KIND_COLOR[event.kind] ?? "var(--brand)" }}
          />
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
            {event.time}
          </p>
          <p className="text-sm text-foreground">{event.title}</p>
        </li>
      ))}
    </ol>
  );
}

const DEMO: TimelineData = {
  events: [
    { time: "Dec 2024", title: "Trip to Goa", kind: "travel" },
    { time: "This week", title: "Midnight City — M83", kind: "music" },
    { time: "Today", title: "Design review · 5:30", kind: "event" },
  ],
};

export const timelineWidget = defineWidget<TimelineData>({
  manifest: {
    id: "timeline",
    title: "Timeline",
    description: "Your life, connected across sources and time.",
    icon: GitCommitVertical,
    category: "activity",
    supportedSizes: ["lg", "tall"],
    defaultSize: "tall",
  },
  render: TimelineRenderer,
  getData: async (): Promise<TimelineData> => {
    try {
      return await widgetsApi.get<TimelineData>("timeline");
    } catch {
      return DEMO;
    }
  },
});
