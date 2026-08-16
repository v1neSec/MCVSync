import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";
import { LoadingButton } from "@/components/LoadingButton";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/useInventory";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";
import type { Category } from "@/types/inventory";

export const Route = createFileRoute("/_authenticated/items/categories")({
  beforeLoad: requireRole("purchasing", "admin", "super_admin"),
  component: CategoriesPage,
  errorComponent: RouteErrorFallback,
});

function CategoriesPage() {
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    createMutation.mutate({ name: newName }, { onSuccess: () => setNewName("") });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground">Reference data used by the item catalog.</p>
      </div>

      <form onSubmit={handleCreate} className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="new-category-name">
            New category
          </label>
          <Input
            id="new-category-name"
            required
            placeholder="e.g. Consumables"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <LoadingButton type="submit" isPending={createMutation.isPending} pendingText="Adding...">
          <Plus />
          Add
        </LoadingButton>
      </form>

      {createMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{getErrorMessage(createMutation.error)}</AlertDescription>
        </Alert>
      )}

      {categoriesQuery.isPending && <TableSkeleton rows={5} columns={2} />}

      {categoriesQuery.isError && (
        <EmptyState
          title="Couldn't load categories"
          description={getErrorMessage(categoriesQuery.error)}
        />
      )}

      {categoriesQuery.data && categoriesQuery.data.length === 0 && (
        <EmptyState title="No categories yet" description="Add the first one above." />
      )}

      {categoriesQuery.data && categoriesQuery.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesQuery.data.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                isEditing={editingId === category.id}
                onEdit={() => setEditingId(category.id)}
                onDone={() => setEditingId(null)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  isEditing,
  onEdit,
  onDone,
}: {
  category: Category;
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const [name, setName] = useState(category.name);

  function handleSave() {
    updateMutation.mutate({ id: category.id, payload: { name } }, { onSuccess: onDone });
  }

  function handleDelete() {
    if (window.confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(category.id);
    }
  }

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input value={name} onChange={(event) => setName(event.target.value)} autoFocus />
          {updateMutation.isError && (
            <p className="mt-1 text-xs text-destructive">{getErrorMessage(updateMutation.error)}</p>
          )}
        </TableCell>
        <TableCell className="flex justify-end gap-2 text-right">
          <LoadingButton
            variant="ghost"
            size="icon-sm"
            isPending={updateMutation.isPending}
            onClick={handleSave}
          >
            <Check />
            <span className="sr-only">Save</span>
          </LoadingButton>
          <Button variant="ghost" size="icon-sm" onClick={onDone}>
            <X />
            <span className="sr-only">Cancel</span>
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{category.name}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <Pencil />
            <span className="sr-only">Edit</span>
          </Button>
          <LoadingButton
            variant="ghost"
            size="icon-sm"
            isPending={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash2 />
            <span className="sr-only">Delete</span>
          </LoadingButton>
        </div>
        {deleteMutation.isError && (
          <p className="mt-1 text-xs text-destructive">{getErrorMessage(deleteMutation.error)}</p>
        )}
      </TableCell>
    </TableRow>
  );
}
