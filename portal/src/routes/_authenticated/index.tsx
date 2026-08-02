import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLogoutMutation, useMeQuery } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/login" }),
    });
  }

  if (!meQuery.data) {
    return null;
  }

  const user = meQuery.data;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <p>
            Account type: <span className="font-medium">{user.client_type ?? "Unknown"}</span>
          </p>
          <p>
            Zone: <span className="font-medium">{user.zone?.name ?? "Unassigned"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
