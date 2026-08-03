import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/admin/client-accounts")(
  scaffoldRouteOptions("Portal Accounts", "admin"),
);
