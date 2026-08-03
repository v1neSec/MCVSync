import type { Table } from "dexie";
import type { CachedItem, CachedOrder } from "@/db/schema";

type CacheRow = CachedItem | CachedOrder;

export async function setCached<T extends CacheRow>(
  table: Table<T, string>,
  id: string,
  data: unknown,
): Promise<void> {
  await table.put({ id, data, cachedAt: Date.now() } as T);
}

export async function getCached<T extends CacheRow>(
  table: Table<T, string>,
  id: string,
): Promise<T | undefined> {
  return table.get(id);
}

export async function getAllCached<T extends CacheRow>(
  table: Table<T, string>,
): Promise<T[]> {
  return table.toArray();
}

export async function clearCached<T extends CacheRow>(
  table: Table<T, string>,
): Promise<void> {
  await table.clear();
}
