import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteErrorFallbackProps {
  error: unknown;
  reset?: () => void;
}

export function RouteErrorFallback({ error, reset }: RouteErrorFallbackProps) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <p className="text-sm font-medium text-foreground">
        This page couldn't be loaded
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {reset && (
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Try again
        </Button>
      )}
    </div>
  );
}
