import prisma from "@/lib/prisma";
import {
  TEMPLATES,
  resolveTemplateSlug,
} from "@/features/template/registry/templates";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ invitationSlug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { invitationSlug } = await params;
  const { to } = await searchParams;

  const invitation = await prisma.invitation.findFirst({
    where: { slug: invitationSlug },
    omit: { userId: true },
  });
  if (!invitation || !invitation.isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Undangan tidak tersedia.</p>
      </div>
    );
  }

  let guestSlug: string | undefined;
  let guestName: string | undefined;
  if (to) {
    const guest = await prisma.guest.findFirst({
      where: { slug: to, invitationId: invitation.id },
      select: { slug: true, name: true },
    });
    if (guest) {
      guestSlug = guest.slug;
      guestName = guest.name;
    }
  }

  const state = invitation as unknown as InvitationState;
  const Template = TEMPLATES[resolveTemplateSlug(state.templateSlug)];

  return (
    <Template invitation={state} guestSlug={guestSlug} guestName={guestName} />
  );
}
