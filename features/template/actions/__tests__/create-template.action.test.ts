import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    template: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/template/utils/slug", () => ({
  slugify: vi.fn((s: string) => s.toLowerCase().replace(/\s+/g, "-")),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

import { createTemplateAction } from "../create-template";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { logAudit } from "@/lib/audit";
import { ACTION_MESSAGES } from "@/lib/action-response";

const prismaMock = prisma as unknown as {
  template: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  name: "Coastal",
  category: "Elegant",
  description: "A nice template",
  status: "active" as const,
  thumbnailUrl: "https://res.cloudinary.com/test/image/upload/v1/test.jpg",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createTemplateAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await createTemplateAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.template.create).not.toHaveBeenCalled();
  });

  it("returns name error when template name already used", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue({ name: "Coastal" });
    const result = await createTemplateAction(validInput);
    expect(result.errors?.name).toContain("Nama sudah digunakan");
    expect(prismaMock.template.create).not.toHaveBeenCalled();
  });

  it("creates template and returns success", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue(null);
    prismaMock.template.create.mockResolvedValue({ id: "tpl-1" });
    const result = await createTemplateAction(validInput);
    expect(result.success).toBe(true);
    expect(result.data?.templateId).toBe("tpl-1");
    expect(prismaMock.template.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "Coastal", category: "Elegant" }),
    });
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "template.created",
        targetType: "template",
        targetId: "tpl-1",
      }),
    );
  });

  it("returns _form error on prisma exception", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "superadmin" });
    prismaMock.template.findFirst.mockResolvedValue(null);
    prismaMock.template.create.mockRejectedValue(new Error("db error"));
    const result = await createTemplateAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.SERVER_ERROR);
  });
});
