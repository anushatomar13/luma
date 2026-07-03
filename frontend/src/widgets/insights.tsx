import { Sparkles } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";
import { widgetsApi } from "@/lib/api/widgets";

interface Insight {
  title: string;
  body: string;
}

interface InsightsData {
  insights: Insight[];
}

function InsightsRenderer({ data }: WidgetRenderProps<InsightsData>) {
  return (
    <ul className="flex h-full flex-col justify-center gap-3">
      {data.insights.slice(0, 4).map((insight, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{insight.title}</p>
            <p className="text-sm leading-snug text-muted-foreground">
              {insight.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const DEMO: InsightsData = {
  insights: [
    { title: "On repeat", body: "Midnight City by M83 is your track of the week." },
    { title: "Wanderlust", body: "Goa: 1,487 km over 6 days." },
    { title: "Coming up", body: "Design review is next on your calendar." },
  ],
};

export const insightsWidget = defineWidget<InsightsData>({
  manifest: {
    id: "insights",
    title: "Insights",
    description: "Patterns Luma quietly noticed across your life.",
    icon: Sparkles,
    category: "activity",
    supportedSizes: ["md", "lg"],
    defaultSize: "lg",
  },
  render: InsightsRenderer,
  getData: async (): Promise<InsightsData> => {
    try {
      return await widgetsApi.get<InsightsData>("insights");
    } catch {
      return DEMO;
    }
  },
});
