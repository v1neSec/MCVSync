import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/EmptyState";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
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
import { useAssignEmployeeRoleMutation, useEmployeesQuery } from "@/hooks/useStaff";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";
import { ROLE_LABELS, ROLES, type Role } from "@/types/user";
import type { Employee } from "@/types/staff";

export const Route = createFileRoute("/_authenticated/super-admin/role-assignment")({
  beforeLoad: requireRole("super_admin"),
  component: RoleAssignmentPage,
  errorComponent: RouteErrorFallback,
});

function RoleAssignmentPage() {
  const employeesQuery = useEmployeesQuery();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Role Assignment</h1>
        <p className="text-sm text-muted-foreground">
          Assign which role each staff account holds, including Admin. This is Super Admin's
          authority only.
        </p>
      </div>

      {employeesQuery.isPending && <TableSkeleton rows={6} columns={4} />}

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
        <EmptyState title="No staff accounts yet" />
      )}

      {employeesQuery.data && employeesQuery.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesQuery.data.map((employee) => (
              <RoleAssignmentRow key={employee.id} employee={employee} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function RoleAssignmentRow({ employee }: { employee: Employee }) {
  const assignMutation = useAssignEmployeeRoleMutation();
  const [role, setRole] = useState<Role | "">(employee.role ?? "");

  function handleChange(value: string) {
    const nextRole = value as Role;
    const previousRole = role;

    setRole(nextRole);
    assignMutation.mutate(
      { employeeId: employee.id, role: nextRole },
      { onError: () => setRole(previousRole) },
    );
  }

  return (
    <TableRow>
      <TableCell>{employee.name}</TableCell>
      <TableCell>{employee.email}</TableCell>
      <TableCell>{employee.position}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Select value={role} onValueChange={(value) => value && handleChange(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="No role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {ROLE_LABELS[roleOption]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assignMutation.isPending &&
              assignMutation.variables?.employeeId === employee.id && (
                <span className="text-xs text-muted-foreground">Saving...</span>
              )}
          </div>
          {assignMutation.isError &&
            assignMutation.variables?.employeeId === employee.id && (
              <Alert variant="destructive" className="py-1.5">
                <AlertDescription>{getErrorMessage(assignMutation.error)}</AlertDescription>
              </Alert>
            )}
        </div>
      </TableCell>
    </TableRow>
  );
}
