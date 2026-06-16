import { getCurrentUser } from "@/features/auth/utils/session";
import cloudinary from "@/lib/cloudinary";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const kind = new URL(request.url).searchParams.get("kind");

  // Audio: no image transform/format. Cloudinary stores audio under the
  // `auto`/video resource type, so we sign only timestamp + folder.
  if (kind === "audio") {
    const folder = "invitations/music";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return Response.json({
      signature,
      timestamp,
      folder,
      resourceType: "auto",
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  }

  // Image (default): cap dimensions, auto-compress, store as WebP. Both params
  // must be signed and sent verbatim from the client, or the signature fails.
  const folder = "templates/thumbnails";
  const transformation = "c_limit,w_1600,q_auto:good";
  const format = "webp";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, transformation, format },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return Response.json({
    signature,
    timestamp,
    folder,
    transformation,
    format,
    resourceType: "image",
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
