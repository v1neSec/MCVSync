import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/purchases-overview")(
  scaffoldRouteOptions("Purchases Overview", "super_admin"),
);
