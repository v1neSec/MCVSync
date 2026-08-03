import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-destructive px-4 py-2 text-center text-sm text-white">
      You're offline. Changes will sync once you're back online.
    </div>
  );
}
