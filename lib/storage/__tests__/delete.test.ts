import { describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn<(command: { input: unknown }) => Promise<unknown>>(
    async () => ({}),
  ),
}));
vi.mock("../client", () => ({
  r2: { send: sendMock },
  R2_BUCKET: "test-bucket",
}));

import { deleteObject } from "../delete";

describe("deleteObject", () => {
  it("sends a DeleteObjectCommand with the key", async () => {
    await deleteObject("invitations/gallery/x.webp");
    expect(sendMock).toHaveBeenCalledTimes(1);
    const command = sendMock.mock.calls[0][0];
    expect(command.input).toEqual({
      Bucket: "test-bucket",
      Key: "invitations/gallery/x.webp",
    });
  });
});
