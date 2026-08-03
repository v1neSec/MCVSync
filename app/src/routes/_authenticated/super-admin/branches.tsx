import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/branches")(
  scaffoldRouteOptions("All Branches", "super_admin"),
);
