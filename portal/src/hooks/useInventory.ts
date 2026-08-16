import { useQuery } from "@tanstack/react-query";
import * as inventoryApi from "@/api/inventory";

export const itemsQueryKey = (params: inventoryApi.ListItemsParams) =>
  ["items", params] as const;
export const categoriesQueryKey = ["categories"] as const;

export function useItemsQuery(params: inventoryApi.ListItemsParams) {
  return useQuery({
    queryKey: itemsQueryKey(params),
    queryFn: () => inventoryApi.listItems(params),
    placeholderData: (previous) => previous,
  });
}

export function useCategoriesQuery() {
  return useQuery({ queryKey: categoriesQueryKey, queryFn: inventoryApi.listCategories });
}
