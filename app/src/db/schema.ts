import Dexie, { type EntityTable } from "dexie";

export interface CachedItem {
  id: string;
  data: unknown;
  cachedAt: number;
}

export interface CachedOrder {
  id: string;
  data: unknown;
  cachedAt: number;
}

export type PendingMutationStatus = "pending" | "syncing" | "failed";

export interface PendingMutation {
  id: number;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  payload: unknown;
  created_at: number;
  status: PendingMutationStatus;
  error_reason?: string;
}

export class AppDatabase extends Dexie {
  cached_items!: EntityTable<CachedItem, "id">;
  cached_orders!: EntityTable<CachedOrder, "id">;
  pending_mutations!: EntityTable<PendingMutation, "id">;

  constructor() {
    super("mcvsync_app");

    this.version(1).stores({
      cached_items: "id, cachedAt",
      cached_orders: "id, cachedAt",
      pending_mutations: "++id, status, created_at",
    });
  }
}

export const db = new AppDatabase();
