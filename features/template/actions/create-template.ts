"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  createTemplateActionSchema,
  CreateTemplateActionType,
} from "../schemas/create-template";
import prisma from "@/lib/prisma";
import { slugify } from "../utils/slug";

type FieldErrors = Partial<
  Record<keyof CreateTemplateActionType | "_form", string[]>
>;

export type CreateTemplateResult =
  | { errors: FieldErrors; success?: undefined; templateId?: undefined }
  | { errors?: undefined; success: true; templateId: string };

export async function createTemplateAction(
  input: CreateTemplateActionType,
): Promise<CreateTemplateResult> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const parsed = createTemplateActionSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
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
        return { errors: { name: ["Name already in use"] } };
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

    return { success: true, templateId: template.id };
  } catch (err) {
    console.log("Create template error: ", err);

    return {
      errors: { _form: ["Failed to create template, please try again"] },
    };
  }
}
