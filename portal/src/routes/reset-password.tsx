import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useResetPasswordMutation } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: String(search.token ?? ""),
    email: String(search.email ?? ""),
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, email } = Route.useSearch();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    resetPasswordMutation.mutate(
      { token, email, password, password_confirmation: passwordConfirmation },
      { onSuccess: () => navigate({ to: "/login" }) },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Set a new password</h1>
        </div>

        {resetPasswordMutation.isError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {getErrorMessage(resetPasswordMutation.error)}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            id="password_confirmation"
            type="password"
            required
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {resetPasswordMutation.isPending ? "Saving..." : "Save new password"}
        </button>
      </form>
    </div>
  );
}
