import type { UserRole, UserStatus } from "@/generated/prisma/enums";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  deletedAt: Date | null;
};
