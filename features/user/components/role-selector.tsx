"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateRoleAction } from "../actions/update-role.action";
import type { UserRole } from "@/generated/prisma/enums";

const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export function RoleSelector({
  userId,
  currentRole,
  allowedRoles,
}: {
  userId: string;
  currentRole: UserRole;
  allowedRoles: UserRole[];
}) {
  const [selected, setSelected] = useState<UserRole>(currentRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roles = ALL_ROLES.filter((r) => allowedRoles.includes(r.value));

  function handleSave() {
    if (selected === currentRole) return;
    startTransition(async () => {
      const result = await updateRoleAction(userId, selected);
      if (result.errors) {
        toast.error(result.errors._form[0]);
      } else {
        toast.success("Role updated successfully.");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelected(role.value)}
            className={`rounded-md border px-4 py-2 text-sm transition-colors ${
              selected === role.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-muted"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
      <Button
        onClick={handleSave}
        disabled={isPending || selected === currentRole}
        size="sm"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Role"
        )}
      </Button>
    </div>
  );
}
