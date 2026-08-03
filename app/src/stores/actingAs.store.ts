import { create } from "zustand";
import type { Role } from "@/types/user";

interface ActingAsState {
  actingAs: Role | null;
  setActingAs: (role: Role) => void;
  clear: () => void;
}

export const useActingAsStore = create<ActingAsState>((set) => ({
  actingAs: null,
  setActingAs: (role) => set({ actingAs: role }),
  clear: () => set({ actingAs: null }),
}));
