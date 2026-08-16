export interface Category {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  code: string;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  category: Category | null;
  unit: Unit | null;
  description: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
