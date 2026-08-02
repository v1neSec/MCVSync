import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useForgotPasswordMutation } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    forgotPasswordMutation.mutate({ email });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {forgotPasswordMutation.isSuccess ? (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            If that account exists, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {forgotPasswordMutation.isError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {getErrorMessage(forgotPasswordMutation.error)}
              </p>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <Link to="/login" className="block text-center text-sm text-gray-500 hover:text-gray-900">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
