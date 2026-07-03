import { TopBar } from "@/components/app/top-bar";
import { RecapView } from "@/features/recap/recap-view";

export default function RecapPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar />
      <RecapView />
    </div>
  );
}
