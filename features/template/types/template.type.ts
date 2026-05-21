import type { TemplateStatus } from "@/generated/prisma/enums";

export type TemplateListItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  thumbnailUrl: string;
  demoUrl: string;
  tags: string[];
  status: TemplateStatus;
  createdAt: Date;
  deletedAt: Date | null;
};
