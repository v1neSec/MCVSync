import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/admin/categories")(
  scaffoldRouteOptions("Categories", "admin"),
);
