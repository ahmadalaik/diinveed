import { authIsRequired } from "@/features/auth/utils/middleware";
import { getOrCreateInvitation } from "@/features/invitation/actions/get-or-create-invitation";
import { getWishesForHost } from "@/features/invitation/actions/get-wishes-for-host";
import { WishesSettings } from "@/features/invitation/components/wishes/wishes-settings";
import { WishesList } from "@/features/invitation/components/wishes/wishes-list";
import { DEFAULT_WISHES_OPTIONS } from "@/features/invitation/schemas/wish.schema";
import type { WishModerationStatus } from "@/features/invitation/types/invitation.type";
import type { PageSearchParams } from "@/lib/pagination";

const STATUSES: WishModerationStatus[] = ["PENDING", "APPROVED", "HIDDEN"];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RsvpPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  await authIsRequired();
  const sp = await searchParams;

  const statusRaw = first(sp.status);
  const status = STATUSES.includes(statusRaw as WishModerationStatus)
    ? (statusRaw as WishModerationStatus)
    : undefined;
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);

  const [invitationRes, wishesRes] = await Promise.all([
    getOrCreateInvitation(),
    getWishesForHost({ page, status }),
  ]);

  if (wishesRes.errors || !invitationRes.success) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Ucapan</h1>
        <p className="text-muted-foreground">
          {wishesRes.errors?._form[0] ?? invitationRes.message}
        </p>
      </div>
    );
  }

  const options = invitationRes.data?.wishesOptions ?? DEFAULT_WISHES_OPTIONS;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ucapan</h1>
      <WishesSettings options={options} />
      <WishesList
        rows={wishesRes.rows}
        counts={wishesRes.counts}
        activeStatus={status}
        page={wishesRes.page}
        totalPages={wishesRes.totalPages}
      />
    </div>
  );
}
