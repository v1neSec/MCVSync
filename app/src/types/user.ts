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
  role: string | null;
  branch: Branch | null;
  permissions: string[];
}
