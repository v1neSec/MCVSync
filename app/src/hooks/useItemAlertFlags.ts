import { useMemo } from "react";
import { useExpiringAlertsQuery, useLowStockAlertsQuery } from "@/hooks/useInventory";

export type ItemAlertStatus = "low_stock" | "expiring_soon" | "ok";

/**
 * The Items List badge must come from the alert endpoints, never
 * recomputed client-side. Both alert lists are fetched at the backend's
 * per_page cap (100) so a single page covers this catalog's realistic
 * scale — a catalog with more than 100 simultaneously flagged items would
 * need real cursor-following here, which isn't built yet.
 */
export function useItemAlertFlags() {
  const lowStockQuery = useLowStockAlertsQuery({ per_page: 100 });
  const expiringQuery = useExpiringAlertsQuery({ per_page: 100 });

  const lowStockIds = useMemo(
    () => new Set(lowStockQuery.data?.data.map((row) => row.item_id) ?? []),
    [lowStockQuery.data],
  );

  const expiringIds = useMemo(
    () => new Set(expiringQuery.data?.data.map((row) => row.item?.id).filter((id) => id != null)),
    [expiringQuery.data],
  );

  function statusFor(itemId: number): ItemAlertStatus {
    if (lowStockIds.has(itemId)) {
      return "low_stock";
    }
    if (expiringIds.has(itemId)) {
      return "expiring_soon";
    }
    return "ok";
  }

  return {
    statusFor,
    isLoading: lowStockQuery.isPending || expiringQuery.isPending,
  };
}
