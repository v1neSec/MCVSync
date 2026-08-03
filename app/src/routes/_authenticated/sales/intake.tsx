import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/sales/intake")(
  scaffoldRouteOptions("Purchase Orders", "sales"),
);
