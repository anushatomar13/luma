"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

type Mode = "login" | "register";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-white/25 focus:bg-white/[0.05]";

export function AuthForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === "register"
          ? await authApi.register({ email, password, name })
          : await authApi.login({ email, password });
      setAuth(res.access_token, res.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Is the API running?",
      );
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass w-full max-w-sm rounded-3xl p-7"
    >
      <h1 className="text-gradient-brand text-3xl font-semibold tracking-tight">
        Luma
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        {mode === "register"
          ? "Create your account to begin."
          : "Welcome back."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={fieldClass}
          />
        )}
        <input
          aria-label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={fieldClass}
        />
        <input
          aria-label="Password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          className={fieldClass}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {mode === "register" ? "Create account" : "Sign in"}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "register" ? "login" : "register"));
          setError(null);
        }}
        className="mt-5 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {mode === "register"
          ? "Already have an account? Sign in"
          : "New to Luma? Create an account"}
      </button>
    </motion.div>
  );
}
