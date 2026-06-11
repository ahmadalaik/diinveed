import { getCurrentUser } from "@/features/auth/utils/session";
import { deleteObject } from "@/lib/storage/delete";

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { key } = await request.json();
  if (typeof key !== "string" || !key) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  await deleteObject(key);
  return Response.json({ success: true });
}
