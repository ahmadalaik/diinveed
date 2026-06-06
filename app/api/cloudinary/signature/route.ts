import { getCurrentUser } from "@/features/auth/utils/session";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "templates/thumbnails";
  // Incoming transformation: cap dimensions and auto-compress the image before
  // storing, then convert the stored asset to WebP. Both params must be signed
  // and sent verbatim from the client, otherwise the signature is invalid.
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
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
