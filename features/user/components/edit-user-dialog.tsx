"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import type { UserListItem } from "../types/user.type";
import type { UserRole } from "@/generated/prisma/enums";

interface EditUserDialogProps {
  user: UserListItem;
  actorRole: UserRole;
}

export function EditUserDialog({ user, actorRole }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  const defaultValues = {
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role,
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm
            mode="edit"
            userId={user.id}
            defaultValues={defaultValues}
            actorRole={actorRole}
            onSuccess={handleSuccess}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
