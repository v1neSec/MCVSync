import { db } from "@/db/schema";
import type { PendingMutation } from "@/db/schema";

export async function enqueueMutation(
  method: PendingMutation["method"],
  url: string,
  payload: unknown,
): Promise<number> {
  return db.pending_mutations.add({
    method,
    url,
    payload,
    created_at: Date.now(),
    status: "pending",
  });
}

export async function listPendingMutations(): Promise<PendingMutation[]> {
  return db.pending_mutations.orderBy("created_at").toArray();
}

export async function markSyncing(id: number): Promise<void> {
  await db.pending_mutations.update(id, { status: "syncing" });
}

export async function markFailed(id: number, errorReason: string): Promise<void> {
  await db.pending_mutations.update(id, {
    status: "failed",
    error_reason: errorReason,
  });
}

export async function removeMutation(id: number): Promise<void> {
  await db.pending_mutations.delete(id);
}
