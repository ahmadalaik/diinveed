import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2_BUCKET, r2 } from "./client";
import { buildKey, type KeyScope } from "./keys";
import type { StorageKind } from "./types";

export interface CreateUploadUrlInput {
  kind: StorageKind;
  ext: string;
  contentType: string;
  /** Required for invitation-scoped kinds; omit for `thumbnail`. */
  scope?: KeyScope;
  fileName?: string | null;
}

export interface CreateUploadUrlResult {
  uploadUrl: string;
  key: string;
}

export async function createUploadUrl({
  kind,
  ext,
  contentType,
  scope,
  fileName,
}: CreateUploadUrlInput): Promise<CreateUploadUrlResult> {
  const key = buildKey(kind, ext, scope, fileName);
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 600 });
  return { uploadUrl, key };
}
