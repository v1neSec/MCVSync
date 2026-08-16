import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { meQueryOptions } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <PortalShell>
      <Outlet />
    </PortalShell>
  ),
});
