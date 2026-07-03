"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { StepProfile } from "./steps/step-profile";
import { StepInterests } from "./steps/step-interests";
import { StepTheme } from "./steps/step-theme";
import { StepConnections } from "./steps/step-connections";
import { StepBuilding } from "./steps/step-building";

const STEPS = [
  { title: "Welcome to Luma", subtitle: "Let's start with the basics." },
  { title: "What are you into?", subtitle: "We'll tailor your widgets to your world." },
  { title: "Make it yours", subtitle: "Pick an accent and a style." },
  { title: "Connect your life", subtitle: "Bring your data together — or skip for now." },
];

const INTERACTIVE_STEPS = STEPS.length; // 4; step index 4 is the building finale.

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -36 }),
};

export function OnboardingFlow() {
  const mounted = useMounted();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const name = usePreferencesStore((s) => s.profile.name);
  const interests = usePreferencesStore((s) => s.interests);

  const isBuilding = step === INTERACTIVE_STEPS;
  const isLastInteractive = step === INTERACTIVE_STEPS - 1;

  const canContinue =
    step === 0 ? name.trim().length > 0 : step === 1 ? interests.length > 0 : true;

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(INTERACTIVE_STEPS, s + 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const meta = STEPS[step];

  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "var(--brand)", opacity: 0.12 }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {!mounted ? (
          <div className="glass rounded-3xl p-8 text-center">
            <span className="text-gradient-brand text-3xl font-semibold">Luma</span>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 sm:p-8">
            {!isBuilding && (
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, var(--brand), var(--brand-2))",
                      }}
                      animate={{ width: `${((step + 1) / INTERACTIVE_STEPS) * 100}%` }}
                      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {step + 1} / {INTERACTIVE_STEPS}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {meta.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{meta.subtitle}</p>
              </div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && <StepProfile />}
                {step === 1 && <StepInterests />}
                {step === 2 && <StepTheme />}
                {step === 3 && <StepConnections />}
                {isBuilding && <StepBuilding />}
              </motion.div>
            </AnimatePresence>

            {!isBuilding && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                    step === 0
                      ? "invisible"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all",
                    canContinue
                      ? "bg-foreground text-background hover:opacity-90"
                      : "cursor-not-allowed bg-white/10 text-muted-foreground",
                  )}
                >
                  {isLastInteractive ? "Finish" : "Continue"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
