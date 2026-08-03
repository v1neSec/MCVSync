import { PlaceholderPage } from "@/components/PlaceholderPage";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { requireRole } from "@/lib/rbac";
import type { Role } from "@/types/user";

export function scaffoldRouteOptions(title: string, ...roles: Role[]) {
  return {
    beforeLoad: requireRole(...roles),
    component: () => <PlaceholderPage title={title} />,
    errorComponent: RouteErrorFallback,
  };
}
