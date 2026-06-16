import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/storage/delete", () => ({ deleteObject: vi.fn(async () => {}) }));

import { DELETE } from "../route";
import { getCurrentUser } from "@/features/auth/utils/session";
import { deleteObject } from "@/lib/storage/delete";

function req(body: unknown) {
  return new Request("http://localhost/api/storage/object", {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}

describe("DELETE /api/storage/object", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 when unauthenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const res = await DELETE(req({ key: "music/x.mp3" }));
    expect(res.status).toBe(401);
  });

  it("403 when a non-admin deletes a key outside their own prefix", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1", role: "user" } as never);
    const res = await DELETE(
      req({ key: "users/other/invitations/inv1/gallery/a.webp" }),
    );
    expect(res.status).toBe(403);
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it("lets an owner delete an object under their own user prefix", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1", role: "user" } as never);
    const key = "users/u1/invitations/inv1/gallery/a.webp";
    const res = await DELETE(req({ key }));
    expect(res.status).toBe(200);
    expect(deleteObject).toHaveBeenCalledWith(key);
  });

  it("lets an admin delete any key (e.g. a template thumbnail)", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "admin1", role: "admin" } as never);
    const key = "templates/thumbnail/x.webp";
    const res = await DELETE(req({ key }));
    expect(res.status).toBe(200);
    expect(deleteObject).toHaveBeenCalledWith(key);
  });
});
