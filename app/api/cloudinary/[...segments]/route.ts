import { getCurrentUser } from "@/features/auth/utils/session";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { segments } = await params;
  const publicId = segments.join("/");

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok" && result.result !== "not found") {
    return Response.json({ error: "Failed to delete image" }, { status: 500 });
  }

  return Response.json({ success: true });
}
