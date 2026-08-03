import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/purchasing/purchase-orders")(
  scaffoldRouteOptions("Purchase Orders", "purchasing"),
);
