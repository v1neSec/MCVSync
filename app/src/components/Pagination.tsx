import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/inventory";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
      <p className="text-xs text-muted-foreground">
        {meta.total === 0
          ? "No results"
          : `Showing ${meta.from ?? 0}–${meta.to ?? 0} of ${meta.total}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {meta.current_page} of {meta.last_page}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
