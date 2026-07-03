import { TopBar } from "@/components/app/top-bar";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar />
      <DashboardView />
    </div>
  );
}
