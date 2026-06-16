import { RoleBadge } from "./role-badge";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { canManageUser } from "@/lib/permissions";
import type { UserListItem } from "../types/user.type";
import type { UserRole } from "@/generated/prisma/enums";

type CurrentUser = { id: string; role: UserRole };

export function UserDetail({
  user,
  currentUser,
}: {
  user: UserListItem;
  currentUser: CurrentUser;
}) {
  const canManage = canManageUser(currentUser, user);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <EditUserDialog user={user} actorRole={currentUser.role} />
            <DeleteUserDialog userId={user.id} userName={user.name} />
          </div>
        )}
      </div>

      <div className="rounded-lg border">
        <dl className="divide-y">
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={<RoleBadge role={user.role} />} />
          <DetailRow
            label="Status"
            value={
              <span
                className={
                  user.status === "active"
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }
              >
                {user.status === "active" ? "Active" : "Inactive"}
              </span>
            }
          />
          {user.phone && <DetailRow label="Phone" value={user.phone} />}
          <DetailRow
            label="Member since"
            value={user.createdAt.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </dl>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center px-4 py-3 text-sm">
      <dt className="w-32 shrink-0 font-medium text-muted-foreground">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
