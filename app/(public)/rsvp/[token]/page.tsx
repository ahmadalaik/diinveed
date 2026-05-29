import prisma from "@/lib/prisma";
import { getTemplate } from "@/features/template/registry/templates";
import { RsvpForm } from "@/features/invitation/components/rsvp/rsvp-form";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });
  if (!invitation || !invitation.isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Undangan tidak tersedia.</p>
      </div>
    );
  }

  const state = invitation as unknown as InvitationState;
  const Template = getTemplate(state.templateSlug);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <Template invitation={state} />
        <RsvpForm
          token={token}
          rsvpOptions={invitation.rsvpOptions as Record<string, string>}
        />
      </div>
    </div>
  );
}
