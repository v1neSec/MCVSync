import { Badge } from "@/components/ui/badge";
import type { ItemAlertStatus } from "@/hooks/useItemAlertFlags";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<ItemAlertStatus, { label: string; className: string }> = {
  low_stock: { label: "Low Stock", className: "" },
  expiring_soon: {
    label: "Expiring Soon",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  ok: { label: "OK", className: "" },
};

export function StockStatusBadge({ status }: { status: ItemAlertStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={status === "low_stock" ? "destructive" : "outline"}
      className={cn(config.className)}
    >
      {config.label}
    </Badge>
  );
}
