import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-none border border-dashed border-border p-12 text-center">
      <h1 className="text-sm font-medium text-foreground">Orders</h1>
      <p className="max-w-sm text-sm text-muted-foreground">Not yet built.</p>
    </div>
  );
}
