import { getOrCreateInvitation } from "@/features/invitation/actions/get-or-create-invitation";
import { InvitationEditor } from "@/features/invitation/components/editor/invitation-editor";
import { redirect } from "next/navigation";

export default async function InvitationEditPage() {
  const result = await getOrCreateInvitation();
  if (result.errors) redirect("/dashboard");

  return (
    <InvitationEditor initialData={result.invitation} />
  )
}
