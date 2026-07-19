import { randomUUID } from "crypto";
import type { StorageKind } from "./types";

/**
 * Identifies which user + invitation an asset belongs to, so keys nest under
 * `users/<userId>/invitations/<invitationId>/...` and a whole invitation (or
 * user) can be removed by deleting a single prefix.
 */
export interface KeyScope {
  userId: string;
  invitationId: string;
}

/**
 * Build the R2 object key for an upload.
 *
 * - Invitation assets (gallery/couple/cover/music) nest under the user +
 *   invitation prefix and REQUIRE a `scope`.
 * - Template thumbnails are not invitation-scoped and stay flat under
 *   `templates/thumbnail/`.
 */
export function buildKey(
  kind: StorageKind,
  ext: string,
  scope?: KeyScope,
  fileName?: string | null
): string {
  const uuid = randomUUID();

  if (kind === "thumbnail") {
    return `templates/thumbnail/${uuid}.${ext}`;
  }

  if (!scope?.userId || !scope?.invitationId) {
    throw new Error(`buildKey: kind "${kind}" requires a user/invitation scope`);
  }

  if (fileName) {
    return `users/${scope.userId}/invitations/${scope.invitationId}/${kind}/${uuid}/${fileName}`;
  }

  return `users/${scope.userId}/invitations/${scope.invitationId}/${kind}/${uuid}.${ext}`;
}
