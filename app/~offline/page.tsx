export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 text-6xl">📡</div>
      <h1 className="mb-2 text-2xl font-bold">You are offline</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Please check your internet connection and try again. Cached products are
        still available for browsing.
      </p>
    </div>
  );
}
