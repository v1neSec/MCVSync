import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeQuery } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/types/user";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
  errorComponent: RouteErrorFallback,
});

function HomePage() {
  const meQuery = useMeQuery();
  const user = meQuery.data;

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Welcome, {user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground uppercase">Role</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {user.role ? ROLE_LABELS[user.role] : "None"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground uppercase">Branch</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {user.branch?.name ?? "All branches"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground uppercase">
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">{user.permissions.length}</CardContent>
        </Card>
      </div>
    </div>
  );
}
