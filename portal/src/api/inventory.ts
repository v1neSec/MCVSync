import { api } from "@/api/client";
import type { Category, Item, Paginated } from "@/types/inventory";

export interface ListItemsParams {
  page?: number;
  search?: string;
  category_id?: number;
}

export async function listItems(params: ListItemsParams = {}): Promise<Paginated<Item>> {
  const response = await api.get<Paginated<Item>>("/items", { params });
  return response.data;
}

export async function listCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}
