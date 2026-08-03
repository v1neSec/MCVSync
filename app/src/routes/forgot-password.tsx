import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  errorComponent: RouteErrorFallback,
});

function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    forgotPasswordMutation.mutate({ email });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Reset your password</CardTitle>
          <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {forgotPasswordMutation.isSuccess ? (
            <Alert>
              <CheckCircle2 />
              <AlertDescription>
                If that account exists, a reset link has been sent.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {forgotPasswordMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>
                    {getErrorMessage(forgotPasswordMutation.error)}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                isPending={forgotPasswordMutation.isPending}
                pendingText="Sending..."
              >
                Send reset link
              </LoadingButton>
            </form>
          )}

          <Link to="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
