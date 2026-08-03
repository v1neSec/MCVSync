import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/sales-overview")(
  scaffoldRouteOptions("Sales Overview", "super_admin"),
);
