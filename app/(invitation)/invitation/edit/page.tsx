import { authIsRequired } from "@/features/auth/utils/middleware";
import { getOrCreateInvitation } from "@/features/invitation/actions/get-or-create-invitation";
import { InvitationEditor } from "@/features/invitation/components/editor/invitation-editor";
import { redirect } from "next/navigation";

export default async function InvitationEditPage() {
  await authIsRequired();

  const result = await getOrCreateInvitation();
  if (!result.success || !result.data) redirect("/dashboard");

  return <InvitationEditor initialData={result.data} />;
}
