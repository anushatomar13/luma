import { AuthForm } from "@/features/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "var(--brand)", opacity: 0.12 }}
      />
      <div className="relative z-10 flex w-full justify-center">
        <AuthForm />
      </div>
    </main>
  );
}
