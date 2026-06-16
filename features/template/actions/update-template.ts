"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  editTemplateActionSchema,
  EditTemplateActionType,
} from "../schemas/edit-template";
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

export async function updateTemplateAction(
  input: EditTemplateActionType & { id: string },
): Promise<ActionResponse> {
  const actor = await getCurrentUser();
  if (!actor) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const { id, ...rest } = input;

  const parsed = editTemplateActionSchema.safeParse(rest);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, category, description, thumbnailUrl, status } = parsed.data;

  try {
    const existing = await prisma.template.findFirst({
      where: { deletedAt: null, name, NOT: { id } },
      select: { id: true },
    });

    if (existing) {
      return fail("Nama sudah digunakan", { name: ["Nama sudah digunakan"] });
    }

    await prisma.template.update({
      where: { id },
      data: {
        name,
        slug: slugify(name),
        category,
        description: description ?? null,
        thumbnailUrl,
        status,
      },
    });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "template.updated",
      targetType: "template",
      targetId: id,
      targetLabel: parsed.data.name ?? id,
    });

    return ok("Template berhasil diperbarui");
  } catch (err) {
    console.log("Update template error: ", err);
    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
