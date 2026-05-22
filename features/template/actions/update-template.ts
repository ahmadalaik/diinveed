"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  editTemplateActionSchema,
  EditTemplateActionType,
} from "../schemas/edit-template";
import prisma from "@/lib/prisma";
import { slugify } from "../utils/slug";

type FieldErrors = Partial<
  Record<keyof EditTemplateActionType | "_form", string[]>
>;

export type UpdateTemplateResult =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function updateTemplateAction(
  input: EditTemplateActionType & { id: string },
): Promise<UpdateTemplateResult> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const { id, ...rest } = input;

  const parsed = editTemplateActionSchema.safeParse(rest);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, category, description, thumbnailUrl, status } = parsed.data;

  try {
    const existing = await prisma.template.findFirst({
      where: { deletedAt: null, name, NOT: { id } },
      select: { id: true },
    });

    if (existing) {
      return { errors: { name: ["Name already in use"] } };
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

    return { success: true };
  } catch (err) {
    console.log("Update template error: ", err);
    return { errors: { _form: ["Failed to update template, please try again"] } };
  }
}
