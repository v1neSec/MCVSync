import { redirect } from "@tanstack/react-router";
import { useActingAsStore } from "@/stores/actingAs.store";
import type { Role, User } from "@/types/user";

export function getEffectiveRole(user: User): Role | null {
  return useActingAsStore.getState().actingAs ?? user.role;
}

export function requireRole(...roles: Role[]) {
  return ({ context }: { context: { user: User } }) => {
    const effectiveRole = getEffectiveRole(context.user);

    if (!effectiveRole || !roles.includes(effectiveRole)) {
      throw redirect({ to: "/unauthorized" });
    }
  };
}
