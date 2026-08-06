import type { Branch, Role } from "@/types/user";

export interface Employee {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  position: string;
  branch: Branch | null;
  role: Role | null;
}

export interface Permission {
  id: number;
  name: string;
}

export interface RoleWithPermissions {
  name: Role;
  permissions: Permission[];
}
