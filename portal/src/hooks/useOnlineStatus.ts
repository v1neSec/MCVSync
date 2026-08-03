import { useEffect, useState } from "react";
import { notify } from "@/lib/notifications";

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      notify("back-online");
    }

    function handleOffline() {
      setIsOnline(false);
      notify("offline");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
