import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: null | User;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));