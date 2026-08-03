import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/branch-dashboards")(
  scaffoldRouteOptions("Branch Dashboards", "super_admin"),
);
