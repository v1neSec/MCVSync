import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/accounting/pending-pricing")(
  scaffoldRouteOptions("Pending Pricing Requests", "accounting"),
);
