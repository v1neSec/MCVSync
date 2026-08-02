export interface Zone {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  client_type: "direct" | "reseller" | null;
  zone: Zone | null;
}
