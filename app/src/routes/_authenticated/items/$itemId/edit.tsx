import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmptyState } from "@/components/EmptyState";
import { ItemForm } from "@/components/inventory/ItemForm";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useItemQuery, useUpdateItemMutation } from "@/hooks/useInventory";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";

export const Route = createFileRoute("/_authenticated/items/$itemId/edit")({
  beforeLoad: requireRole("purchasing", "admin", "super_admin"),
  component: ItemEditPage,
  errorComponent: RouteErrorFallback,
});

function ItemEditPage() {
  const { itemId } = Route.useParams();
  const navigate = useNavigate();
  const itemQuery = useItemQuery(Number(itemId));
  const updateMutation = useUpdateItemMutation();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Edit Item</h1>
        {itemQuery.data && <p className="text-sm text-muted-foreground">{itemQuery.data.name}</p>}
      </div>

      {itemQuery.isPending && (
        <div className="max-w-2xl space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {itemQuery.isError && (
        <EmptyState
          title="Couldn't load this item"
          description={getErrorMessage(itemQuery.error)}
          action={
            <Button variant="outline" size="sm" onClick={() => itemQuery.refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {itemQuery.data && (
        <div className="max-w-2xl">
          <ItemForm
            initialItem={itemQuery.data}
            isPending={updateMutation.isPending}
            submitError={updateMutation.error}
            onSubmit={(payload) =>
              updateMutation.mutate(
                { id: itemQuery.data.id, payload },
                {
                  onSuccess: () =>
                    navigate({ to: "/items/$itemId", params: { itemId: String(itemQuery.data.id) } }),
                },
              )
            }
          />
        </div>
      )}
    </div>
  );
}
