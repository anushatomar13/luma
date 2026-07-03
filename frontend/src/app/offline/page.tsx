export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="text-gradient-brand text-4xl font-semibold tracking-tight">
        Luma
      </p>
      <p className="mt-4 text-muted-foreground">
        You&apos;re offline. Your dashboard will be back the moment you reconnect.
      </p>
    </main>
  );
}
