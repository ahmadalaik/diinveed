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

  it("403 for non-admin", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u", role: "user" } as never);
    const res = await DELETE(req({ key: "music/x.mp3" }));
    expect(res.status).toBe(403);
  });

  it("deletes for admin", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u", role: "admin" } as never);
    const res = await DELETE(req({ key: "music/x.mp3" }));
    expect(res.status).toBe(200);
    expect(deleteObject).toHaveBeenCalledWith("music/x.mp3");
  });
});
