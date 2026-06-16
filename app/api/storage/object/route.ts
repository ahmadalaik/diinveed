import { getCurrentUser } from "@/features/auth/utils/session";
import { deleteObject } from "@/lib/storage/delete";

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await request.json();
  if (typeof key !== "string" || !key) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Owners may delete only objects under their own `users/<id>/` prefix (their
  // invitation assets). Admins may delete anything (template thumbnails,
  // moderation). This relies on the key convention from lib/storage/keys.ts.
  const isAdmin = user.role === "admin" || user.role === "super_admin";
  const ownsKey = key.startsWith(`users/${user.id}/`);
  if (!isAdmin && !ownsKey) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteObject(key);
  return Response.json({ success: true });
}
