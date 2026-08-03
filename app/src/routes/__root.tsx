import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { OfflineBanner } from "@/components/OfflineBanner";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";

export interface RouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => (
  <>
    <OfflineBanner />
    <Outlet />
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: RouteErrorFallback,
});
