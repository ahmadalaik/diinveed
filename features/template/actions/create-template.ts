"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  createTemplateActionSchema,
  CreateTemplateActionType,
} from "../schemas/create-template";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { slugify } from "../utils/slug";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function createTemplateAction(
  input: CreateTemplateActionType,
): Promise<ActionResponse<{ templateId: string }>> {
  const actor = await getCurrentUser();
  if (!actor) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const parsed = createTemplateActionSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, category, description, thumbnailUrl, status } = parsed.data;

  try {
    const existing = await prisma.template.findFirst({
      where: {
        deletedAt: null,
        OR: [{ name }, { thumbnailUrl }],
      },
      select: { name: true },
    });

    if (existing) {
      if (existing.name === name) {
        return fail("Nama sudah digunakan", { name: ["Nama sudah digunakan"] });
      }
    }

    const template = await prisma.template.create({
      data: {
        name,
        slug: slugify(name),
        category,
        description: description ?? null,
        thumbnailUrl,
        demoUrl: slugify(name),
        status,
      },
    });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "template.created",
      targetType: "template",
      targetId: template.id,
      targetLabel: parsed.data.name ?? template.id,
    });

    return ok("Template berhasil dibuat", { templateId: template.id });
  } catch (err) {
    console.log("Create template error: ", err);

    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
