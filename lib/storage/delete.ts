import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { R2_BUCKET, r2 } from "./client";

export async function deleteObject(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
