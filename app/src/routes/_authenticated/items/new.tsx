import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ItemForm } from "@/components/inventory/ItemForm";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { useCreateItemMutation } from "@/hooks/useInventory";
import { requireRole } from "@/lib/rbac";

export const Route = createFileRoute("/_authenticated/items/new")({
  beforeLoad: requireRole("purchasing", "admin", "super_admin"),
  component: ItemCreatePage,
  errorComponent: RouteErrorFallback,
});

function ItemCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateItemMutation();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">New Item</h1>
        <p className="text-sm text-muted-foreground">Add an item to the catalog.</p>
      </div>

      <div className="max-w-2xl">
        <ItemForm
          isPending={createMutation.isPending}
          submitError={createMutation.error}
          onSubmit={(payload) =>
            createMutation.mutate(payload, {
              onSuccess: (item) => navigate({ to: "/items/$itemId", params: { itemId: String(item.id) } }),
            })
          }
        />
      </div>
    </div>
  );
}
