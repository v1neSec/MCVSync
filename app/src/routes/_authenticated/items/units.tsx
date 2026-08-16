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
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useUnitsQuery,
  useUpdateUnitMutation,
} from "@/hooks/useInventory";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";
import type { Unit } from "@/types/inventory";

export const Route = createFileRoute("/_authenticated/items/units")({
  beforeLoad: requireRole("purchasing", "admin", "super_admin"),
  component: UnitsPage,
  errorComponent: RouteErrorFallback,
});

function UnitsPage() {
  const unitsQuery = useUnitsQuery();
  const createMutation = useCreateUnitMutation();
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    createMutation.mutate(
      { code: newCode, name: newName },
      {
        onSuccess: () => {
          setNewCode("");
          setNewName("");
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Units of Measure</h1>
        <p className="text-sm text-muted-foreground">Reference data used by the item catalog.</p>
      </div>

      <form onSubmit={handleCreate} className="flex items-end gap-2">
        <div className="flex w-28 flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="new-unit-code">
            Code
          </label>
          <Input
            id="new-unit-code"
            required
            placeholder="kg"
            value={newCode}
            onChange={(event) => setNewCode(event.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="new-unit-name">
            Name
          </label>
          <Input
            id="new-unit-name"
            required
            placeholder="Kilograms"
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

      {unitsQuery.isPending && <TableSkeleton rows={5} columns={3} />}

      {unitsQuery.isError && (
        <EmptyState title="Couldn't load units" description={getErrorMessage(unitsQuery.error)} />
      )}

      {unitsQuery.data && unitsQuery.data.length === 0 && (
        <EmptyState title="No units yet" description="Add the first one above." />
      )}

      {unitsQuery.data && unitsQuery.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitsQuery.data.map((unit) => (
              <UnitRow
                key={unit.id}
                unit={unit}
                isEditing={editingId === unit.id}
                onEdit={() => setEditingId(unit.id)}
                onDone={() => setEditingId(null)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function UnitRow({
  unit,
  isEditing,
  onEdit,
  onDone,
}: {
  unit: Unit;
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const updateMutation = useUpdateUnitMutation();
  const deleteMutation = useDeleteUnitMutation();
  const [code, setCode] = useState(unit.code);
  const [name, setName] = useState(unit.name);

  function handleSave() {
    updateMutation.mutate({ id: unit.id, payload: { code, name } }, { onSuccess: onDone });
  }

  function handleDelete() {
    if (window.confirm(`Delete unit "${unit.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(unit.id);
    }
  }

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input value={code} onChange={(event) => setCode(event.target.value)} className="w-24" autoFocus />
        </TableCell>
        <TableCell>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
          {updateMutation.isError && (
            <p className="mt-1 text-xs text-destructive">{getErrorMessage(updateMutation.error)}</p>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
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
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{unit.code}</TableCell>
      <TableCell>{unit.name}</TableCell>
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
