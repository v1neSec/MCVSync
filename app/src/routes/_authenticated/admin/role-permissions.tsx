import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { CardSkeleton } from "@/components/CardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingButton } from "@/components/LoadingButton";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  usePermissionsQuery,
  useRolesQuery,
  useUpdateRolePermissionsMutation,
} from "@/hooks/useStaff";
import { getErrorMessage } from "@/lib/errors";
import { requireRole } from "@/lib/rbac";
import { ROLE_LABELS, ROLES, type Role } from "@/types/user";
import type { Permission } from "@/types/staff";

export const Route = createFileRoute("/_authenticated/admin/role-permissions")({
  beforeLoad: requireRole("admin"),
  component: RolePermissionsPage,
  errorComponent: RouteErrorFallback,
});

function RolePermissionsPage() {
  const rolesQuery = useRolesQuery();
  const permissionsQuery = usePermissionsQuery();
  const loadError = rolesQuery.error ?? permissionsQuery.error;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Roles &amp; Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Toggle which permissions each role includes. Changes take effect immediately, no
          deploy required.
        </p>
      </div>

      {(rolesQuery.isPending || permissionsQuery.isPending) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {(rolesQuery.isError || permissionsQuery.isError) && (
        <EmptyState
          title="Couldn't load roles and permissions"
          description={getErrorMessage(loadError)}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                rolesQuery.refetch();
                permissionsQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        />
      )}

      {rolesQuery.data && permissionsQuery.data && (
        <Tabs defaultValue={ROLES[0]}>
          <TabsList>
            {ROLES.map((role) => (
              <TabsTrigger key={role} value={role}>
                {ROLE_LABELS[role]}
              </TabsTrigger>
            ))}
          </TabsList>
          {ROLES.map((role) => (
            <TabsContent key={role} value={role}>
              <RolePermissionsPanel
                role={role}
                allPermissions={permissionsQuery.data ?? []}
                initialPermissionIds={
                  rolesQuery.data
                    ?.find((entry) => entry.name === role)
                    ?.permissions.map((permission) => permission.id) ?? []
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

interface RolePermissionsPanelProps {
  role: Role;
  allPermissions: Permission[];
  initialPermissionIds: number[];
}

function RolePermissionsPanel({
  role,
  allPermissions,
  initialPermissionIds,
}: RolePermissionsPanelProps) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(initialPermissionIds));
  const updateMutation = useUpdateRolePermissionsMutation();

  function toggle(permissionId: number, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  }

  function handleSave() {
    updateMutation.mutate({ role, permissionIds: Array.from(selected) });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
      {updateMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{getErrorMessage(updateMutation.error)}</AlertDescription>
        </Alert>
      )}

      {updateMutation.isSuccess && (
        <Alert>
          <AlertDescription>Permissions updated.</AlertDescription>
        </Alert>
      )}

      {allPermissions.length === 0 ? (
        <EmptyState title="No permissions defined yet" />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {allPermissions.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selected.has(permission.id)}
                onCheckedChange={(checked) => toggle(permission.id, checked === true)}
              />
              {permission.name}
            </label>
          ))}
        </div>
      )}

      <div>
        <LoadingButton
          onClick={handleSave}
          isPending={updateMutation.isPending}
          pendingText="Saving..."
        >
          Save Changes
        </LoadingButton>
      </div>
    </div>
  );
}
