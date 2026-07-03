"use client";

import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6">
      {/* Ambient brand glows */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-52 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "var(--brand)", opacity: 0.12 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.16, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -right-32 h-[28rem] w-[28rem] rounded-full blur-[140px]"
        style={{ background: "var(--brand-2)", opacity: 0.09 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.12, 0.07] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass mb-8 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground"
        >
          Phase 0 · Foundation
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
          className="text-gradient-brand text-7xl font-semibold tracking-tight sm:text-8xl"
        >
          Luma
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-5 max-w-md text-balance text-lg text-muted-foreground"
        >
          Your life, beautifully understood. The dashboard is coming to life.
        </motion.p>
      </div>
    </main>
  );
}
