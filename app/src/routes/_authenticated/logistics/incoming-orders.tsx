import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/logistics/incoming-orders")(
  scaffoldRouteOptions("Incoming Orders", "logistics"),
);
