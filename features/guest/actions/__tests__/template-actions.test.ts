import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMessageTemplates } from "../get-message-templates";
import { createTemplate } from "../create-template";
import { updateTemplate } from "../update-template";
import { deleteTemplate } from "../delete-template";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    messageTemplate: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  messageTemplate: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };
beforeEach(() => vi.clearAllMocks());

describe("template actions", () => {
  it("lists templates for the user's invitation", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.messageTemplate.findMany.mockResolvedValue([
      { id: "t1", title: "Resmi", body: "Halo" },
    ]);
    const result = await getMessageTemplates();
    expect(result.templates).toEqual([{ id: "t1", title: "Resmi", body: "Halo" }]);
  });

  it("rejects invalid create input", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    const result = await createTemplate({ title: "", body: "" });
    expect(result.errors).toBeDefined();
    expect(prismaMock.messageTemplate.create).not.toHaveBeenCalled();
  });

  it("creates a valid template", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.messageTemplate.create.mockResolvedValue({ id: "t2" });
    const result = await createTemplate({ title: "Resmi", body: "Halo {nama}" });
    expect(result.success).toBe(true);
    expect(prismaMock.messageTemplate.create).toHaveBeenCalledWith({
      data: { invitationId: "inv-1", title: "Resmi", body: "Halo {nama}" },
    });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest_template.created",
      targetType: "guest_template",
    }));
  });

  it("rejects updating a template owned by someone else", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.messageTemplate.findUnique.mockResolvedValue({
      invitation: { userId: "other" },
    });
    const result = await updateTemplate({ id: "t1", title: "X", body: "Y" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Template tidak ditemukan");
    expect(prismaMock.messageTemplate.update).not.toHaveBeenCalled();
  });

  it("updates an owned template", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.messageTemplate.findUnique.mockResolvedValue({
      invitation: { userId: "user-1" },
    });
    prismaMock.messageTemplate.update.mockResolvedValue({ id: "t1" });
    const result = await updateTemplate({ id: "t1", title: "Resmi", body: "Halo {nama}" });
    expect(result.success).toBe(true);
    expect(prismaMock.messageTemplate.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { title: "Resmi", body: "Halo {nama}" },
    });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest_template.updated",
      targetType: "guest_template",
    }));
  });

  it("deletes an owned template", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.messageTemplate.findUnique.mockResolvedValue({
      invitation: { userId: "user-1" },
    });
    prismaMock.messageTemplate.delete.mockResolvedValue({ id: "t1" });
    const result = await deleteTemplate("t1");
    expect(result.success).toBe(true);
    expect(prismaMock.messageTemplate.delete).toHaveBeenCalledWith({ where: { id: "t1" } });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest_template.deleted",
      targetType: "guest_template",
    }));
  });
});
