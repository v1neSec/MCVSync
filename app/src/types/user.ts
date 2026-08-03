export type Role =
  | "sales"
  | "purchasing"
  | "accounting"
  | "logistics"
  | "admin"
  | "super_admin";

export const ROLES: Role[] = [
  "sales",
  "purchasing",
  "accounting",
  "logistics",
  "admin",
  "super_admin",
];

export const ROLE_LABELS: Record<Role, string> = {
  sales: "Sales",
  purchasing: "Purchasing",
  accounting: "Accounting",
  logistics: "Logistics",
  admin: "Admin",
  super_admin: "Super Admin",
};

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  is_main: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role | null;
  branch: Branch | null;
  permissions: string[];
}
