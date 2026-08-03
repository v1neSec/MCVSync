import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/company-analytics")(
  scaffoldRouteOptions("Company Analytics", "super_admin"),
);
