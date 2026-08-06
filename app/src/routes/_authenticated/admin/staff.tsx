import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Ban, CheckCircle2, Pencil, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LoadingButton } from "@/components/LoadingButton";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useActivateEmployeeMutation,
  useBranchesQuery,
  useCreateEmployeeMutation,
  useDeactivateEmployeeMutation,
  useEmployeesQuery,
  useUpdateEmployeeMutation,
} from "@/hooks/useStaff";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";
import type { Employee } from "@/types/staff";

export const Route = createFileRoute("/_authenticated/admin/staff")({
  beforeLoad: requireRole("admin", "super_admin"),
  component: StaffAccountsPage,
  errorComponent: RouteErrorFallback,
});

type DialogState = "new" | Employee | null;

function StaffAccountsPage() {
  const employeesQuery = useEmployeesQuery();
  const deactivateMutation = useDeactivateEmployeeMutation();
  const activateMutation = useActivateEmployeeMutation();
  const [dialogState, setDialogState] = useState<DialogState>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Staff Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and deactivate staff accounts. Role assignment is Super Admin's
            authority.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogState("new")}>
          <Plus />
          New Staff
        </Button>
      </div>

      {employeesQuery.isPending && <TableSkeleton rows={6} columns={6} />}

      {employeesQuery.isError && (
        <EmptyState
          title="Couldn't load staff accounts"
          description={getErrorMessage(employeesQuery.error)}
          action={
            <Button variant="outline" size="sm" onClick={() => employeesQuery.refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {employeesQuery.data && employeesQuery.data.length === 0 && (
        <EmptyState
          title="No staff accounts yet"
          description="Create the first staff account to get started."
        />
      )}

      {employeesQuery.data && employeesQuery.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesQuery.data.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.branch?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={employee.is_active ? "default" : "outline"}>
                    {employee.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDialogState(employee)}
                  >
                    <Pencil />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {employee.is_active ? (
                    <LoadingButton
                      variant="ghost"
                      size="icon-sm"
                      isPending={
                        deactivateMutation.isPending &&
                        deactivateMutation.variables === employee.id
                      }
                      onClick={() => deactivateMutation.mutate(employee.id)}
                    >
                      <Ban />
                      <span className="sr-only">Deactivate</span>
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      variant="ghost"
                      size="icon-sm"
                      isPending={
                        activateMutation.isPending && activateMutation.variables === employee.id
                      }
                      onClick={() => activateMutation.mutate(employee.id)}
                    >
                      <CheckCircle2 />
                      <span className="sr-only">Activate</span>
                    </LoadingButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EmployeeFormDialog state={dialogState} onClose={() => setDialogState(null)} />
    </div>
  );
}

function EmployeeFormDialog({
  state,
  onClose,
}: {
  state: DialogState;
  onClose: () => void;
}) {
  const isEdit = state !== null && state !== "new";
  const branchesQuery = useBranchesQuery();
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [branchId, setBranchId] = useState<string>("");

  useEffect(() => {
    if (isEdit) {
      setName(state.name);
      setEmail(state.email);
      setPassword("");
      setPosition(state.position);
      setBranchId(state.branch ? String(state.branch.id) : "");
    } else if (state === "new") {
      setName("");
      setEmail("");
      setPassword("");
      setPosition("");
      setBranchId("");
    }
  }, [state, isEdit]);

  const mutation = isEdit ? updateMutation : createMutation;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsedBranchId = branchId ? Number(branchId) : null;

    if (isEdit) {
      updateMutation.mutate(
        { id: state.id, payload: { name, email, position, branch_id: parsedBranchId } },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        { name, email, password, position, branch_id: parsedBranchId },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Dialog open={state !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Staff Account" : "New Staff Account"}</DialogTitle>
          <DialogDescription>
            Branch assignment applies to Sales, Purchasing, Accounting, and Logistics roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee-name">Name</Label>
            <Input
              id="employee-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee-email">Email</Label>
            <Input
              id="employee-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee-position">Position</Label>
            <Input
              id="employee-position"
              required
              placeholder="e.g. Purchasing Manager"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </div>

          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="employee-password">Temporary password</Label>
              <Input
                id="employee-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee-branch">Branch</Label>
            <Select value={branchId} onValueChange={(value) => setBranchId(value ?? "")}>
              <SelectTrigger id="employee-branch">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branchesQuery.data?.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" isPending={mutation.isPending} pendingText="Saving...">
              Save
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
