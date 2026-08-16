import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation, useMeQuery } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "home", label: "Home", to: "/" as const },
  { key: "items", label: "Items", to: "/items" as const },
  { key: "orders", label: "Orders", to: "/orders" as const },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/login" }),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <span className="truncate text-sm font-semibold text-foreground">
          {meQuery.data?.name ?? "MCVSync Portal"}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
          <LogOut />
          {logoutMutation.isPending ? "Signing out..." : "Log out"}
        </Button>
      </header>

      <nav className="flex items-center gap-1 overflow-x-auto border-b border-border px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className={cn(
              "shrink-0 rounded-none px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground",
              pathname === item.to && "bg-muted text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
