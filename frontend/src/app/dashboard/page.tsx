import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

export default function DashboardPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Friday · July 3</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your dashboard
        </h1>
      </header>

      <DashboardGrid />
    </main>
  );
}
