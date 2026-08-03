import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/accounting/pending-payments")(
  scaffoldRouteOptions("Pending Payments", "accounting"),
);
