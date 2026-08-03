import { createFileRoute } from "@tanstack/react-router";
import { scaffoldRouteOptions } from "@/lib/scaffoldRoute";

export const Route = createFileRoute("/_authenticated/logistics/ready-to-deliver")(
  scaffoldRouteOptions("Ready to Deliver", "logistics"),
);
