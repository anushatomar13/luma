"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { usePreferencesStore } from "@/lib/store/preferences-store";

const MESSAGES = [
  "Setting up your space…",
  "Personalizing your widgets…",
  "Indexing your world…",
  "Almost ready…",
];

export function StepBuilding() {
  const router = useRouter();
  const completeOnboarding = usePreferencesStore((s) => s.completeOnboarding);
  const [progress, setProgress] = useState(0);

  // Advance the progress bar.
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 55);
    return () => clearInterval(id);
  }, []);

  // When finished, mark onboarded and head to the dashboard.
  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => {
      completeOnboarding();
      router.push("/dashboard");
    }, 600);
    return () => clearTimeout(t);
  }, [progress, completeOnboarding, router]);

  const message = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(progress / 25))];

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <motion.div
        className="text-gradient-brand text-6xl font-semibold tracking-tight"
        animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Luma
      </motion.div>

      <div className="mt-10 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundImage: "linear-gradient(to right, var(--brand), var(--brand-2))",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
