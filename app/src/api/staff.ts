import { api } from "@/api/client";
import type { Employee, Permission, RoleWithPermissions } from "@/types/staff";
import type { Branch, Role } from "@/types/user";

export async function listBranches(): Promise<Branch[]> {
  const response = await api.get<Branch[]>("/staff/branches");
  return response.data;
}

export async function listEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[]>("/staff/employees");
  return response.data;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  branch_id: number | null;
  position: string;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const response = await api.post<Employee>("/staff/employees", payload);
  return response.data;
}

export interface UpdateEmployeePayload {
  name: string;
  email: string;
  branch_id: number | null;
  position: string;
}

export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const response = await api.patch<Employee>(`/staff/employees/${id}`, payload);
  return response.data;
}

export async function deactivateEmployee(id: number): Promise<void> {
  await api.post(`/staff/employees/${id}/deactivate`);
}

export async function activateEmployee(id: number): Promise<void> {
  await api.post(`/staff/employees/${id}/activate`);
}

export async function listRoles(): Promise<RoleWithPermissions[]> {
  const response = await api.get<RoleWithPermissions[]>("/staff/roles");
  return response.data;
}

export async function listPermissions(): Promise<Permission[]> {
  const response = await api.get<Permission[]>("/staff/permissions");
  return response.data;
}

export async function updateRolePermissions(
  role: Role,
  permissionIds: number[],
): Promise<void> {
  await api.put(`/staff/roles/${role}/permissions`, { permission_ids: permissionIds });
}

export async function assignEmployeeRole(employeeId: number, role: Role): Promise<void> {
  await api.put(`/staff/employees/${employeeId}/role`, { role });
}
