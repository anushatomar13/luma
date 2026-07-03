"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Images } from "lucide-react";
import { defineWidget, type WidgetRenderProps } from "@/lib/widget-sdk";

interface Memory {
  title: string;
  subtitle: string;
  /** CSS background for the faux photo (real images arrive with Google Photos in Phase 5). */
  gradient: string;
}

interface MemoryData {
  memories: Memory[];
}

function MemoryRenderer({ data }: WidgetRenderProps<MemoryData>) {
  const [index, setIndex] = useState(0);
  const count = data.memories.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(t);
  }, [count]);

  const memory = data.memories[index];

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col justify-end p-4"
            style={{ backgroundImage: memory.gradient }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="relative">
              <p className="text-base font-semibold text-white">{memory.title}</p>
              <p className="text-xs text-white/70">{memory.subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {data.memories.map((_, i) => (
          <button
            key={i}
            aria-label={`Show memory ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-foreground" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const memoryWidget = defineWidget<MemoryData>({
  manifest: {
    id: "memory",
    title: "Memories",
    description: "This day last year, trips, and moments Luma picked for you.",
    icon: Images,
    category: "memories",
    supportedSizes: ["md", "lg", "tall"],
    defaultSize: "lg",
  },
  render: MemoryRenderer,
  getData: () => ({
    memories: [
      {
        title: "Sunset in Goa",
        subtitle: "This day last year · Dec 2024",
        gradient:
          "linear-gradient(135deg, oklch(0.55 0.18 40), oklch(0.4 0.16 20), oklch(0.3 0.1 300))",
      },
      {
        title: "First snow, Manali",
        subtitle: "Winter memories · Jan 2025",
        gradient:
          "linear-gradient(135deg, oklch(0.6 0.08 240), oklch(0.45 0.1 260), oklch(0.25 0.06 280))",
      },
      {
        title: "Late nights, campus",
        subtitle: "Recent favorite · Mar 2025",
        gradient:
          "linear-gradient(135deg, oklch(0.5 0.16 300), oklch(0.4 0.14 320), oklch(0.3 0.1 260))",
      },
    ],
  }),
});
