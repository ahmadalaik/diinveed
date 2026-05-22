import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    template: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/template/utils/slug", () => ({
  slugify: vi.fn((s: string) => s.toLowerCase().replace(/\s+/g, "-")),
}));

import { updateTemplateAction } from "../update-template";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";

const prismaMock = prisma as unknown as {
  template: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  id: "tpl-1",
  name: "Coastal",
  category: "Elegant",
  description: "A nice template",
  status: "active" as const,
  thumbnailUrl: "https://res.cloudinary.com/test/image/upload/v1/test.jpg",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateTemplateAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await updateTemplateAction(validInput);
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.template.update).not.toHaveBeenCalled();
  });

  it("returns name error when another template uses the same name", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue({ id: "tpl-2" });
    const result = await updateTemplateAction(validInput);
    expect(result.errors?.name).toContain("Name already in use");
    expect(prismaMock.template.update).not.toHaveBeenCalled();
  });

  it("updates template and returns success", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue(null);
    prismaMock.template.update.mockResolvedValue({ id: "tpl-1" });
    const result = await updateTemplateAction(validInput);
    expect(result.success).toBe(true);
    expect(prismaMock.template.update).toHaveBeenCalledWith({
      where: { id: "tpl-1" },
      data: expect.objectContaining({ name: "Coastal", category: "Elegant" }),
    });
  });

  it("returns _form error on prisma exception", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue(null);
    prismaMock.template.update.mockRejectedValue(new Error("db error"));
    const result = await updateTemplateAction(validInput);
    expect(result.errors?._form).toBeDefined();
    expect(result.errors?._form?.[0]).toMatch(/failed/i);
  });
});
