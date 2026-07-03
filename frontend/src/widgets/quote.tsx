import { Quote } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface QuoteData {
  /** Real quote text only — Luma never AI-generates quotes; the AI only *selects* one. */
  text: string;
  author: string;
}

function QuoteRenderer({ data }: WidgetRenderProps<QuoteData>) {
  return (
    <figure className="flex h-full flex-col justify-center">
      <blockquote className="max-w-2xl text-balance text-xl font-medium leading-snug text-foreground/90 sm:text-2xl">
        “{data.text}”
      </blockquote>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        — {data.author}
      </figcaption>
    </figure>
  );
}

export const quoteWidget = defineWidget<QuoteData>({
  manifest: {
    id: "quote",
    title: "Quote",
    description: "A real quote, chosen by AI to fit the moment.",
    icon: Quote,
    category: "inspiration",
    supportedSizes: ["wide", "md"],
    defaultSize: "wide",
  },
  render: QuoteRenderer,
  getData: () => ({
    text: "How we spend our days is, of course, how we spend our lives.",
    author: "Annie Dillard",
  }),
});
