import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeQuery } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  const meQuery = useMeQuery();

  if (!meQuery.data) {
    return null;
  }

  const user = meQuery.data;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            Account type
            <Badge variant="outline" className="capitalize">
              {user.client_type ?? "Unknown"}
            </Badge>
          </p>
          <p>
            Zone: <span className="font-medium text-foreground">{user.zone?.name ?? "Unassigned"}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
