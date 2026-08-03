import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/compare-branches")(
  scaffoldRouteOptions("Compare Branches", "super_admin"),
);
