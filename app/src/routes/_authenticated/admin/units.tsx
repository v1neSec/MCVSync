import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/admin/units")(
  scaffoldRouteOptions("Units of Measure", "admin"),
);
