import { getCurrentUser } from "@/features/auth/utils/session";
import { createUploadUrl } from "@/lib/storage/presign";
import { publicUrl } from "@/lib/storage/url";
import type { StorageKind } from "@/lib/storage/types";

const KINDS: StorageKind[] = ["gallery", "couple", "cover", "thumbnail", "music"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kind, ext, contentType, invitationId } = await request.json();
  if (!KINDS.includes(kind) || typeof ext !== "string" || typeof contentType !== "string") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Invitation-scoped kinds nest under the owner's prefix. userId always comes
  // from the session (never trusted from the client); the client only supplies
  // invitationId. Template thumbnails are unscoped.
  let scope;
  if (kind !== "thumbnail") {
    if (typeof invitationId !== "string" || !invitationId) {
      return Response.json({ error: "Missing invitationId" }, { status: 400 });
    }
    scope = { userId: user.id, invitationId };
  }

  const { uploadUrl, key } = await createUploadUrl({ kind, ext, contentType, scope });
  return Response.json({ uploadUrl, key, publicUrl: publicUrl(key) });
}
