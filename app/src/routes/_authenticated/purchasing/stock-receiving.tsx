import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/purchasing/stock-receiving")(
  scaffoldRouteOptions("Stock Receiving", "purchasing"),
);
