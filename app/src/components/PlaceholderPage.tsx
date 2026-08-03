import { Construction } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <EmptyState
        icon={Construction}
        title="Not yet built"
        description="This page is scaffolded and will be filled in during a future build pass."
      />
    </div>
  );
}
