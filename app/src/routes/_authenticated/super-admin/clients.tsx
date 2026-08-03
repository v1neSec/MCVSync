import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/super-admin/clients")(
  scaffoldRouteOptions("All Clients", "super_admin"),
);
