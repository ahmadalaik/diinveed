import { authIsRequired } from "@/features/auth/utils/middleware";
import { getGuests } from "@/features/guest/actions/get-guests";
import { getGuestSummary } from "@/features/guest/actions/get-guest-summary";
import { getUnregisteredRsvps } from "@/features/guest/actions/get-unregistered-rsvps";
import { getGuestCategories } from "@/features/guest/actions/get-guest-categories";
import { getMessageTemplates } from "@/features/guest/actions/get-message-templates";
import { GuestManager } from "@/features/guest/components/guest-manager";
import { GuestToolbar } from "@/features/guest/components/guest-toolbar";
import type { GuestFilters } from "@/features/guest/lib/guest-where";
import type { GuestStatusFilter } from "@/features/guest/types/guest.type";
import type { PageSearchParams } from "@/lib/pagination";

const STATUSES: GuestStatusFilter[] = ["hadir", "menunggu", "mungkin", "tidak-hadir", "unregistered"];

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function TamuPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  await authIsRequired();
  const sp = await searchParams;

  const statusRaw = first(sp.status);
  const status = STATUSES.includes(statusRaw as GuestStatusFilter)
    ? (statusRaw as GuestStatusFilter)
    : undefined;

  const tab = status === "unregistered" ? "unregistered" : "guests";
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);
  const upage = Math.max(1, Number.parseInt(first(sp.upage) ?? "1", 10) || 1);

  const filters: GuestFilters = {
    q: first(sp.q),
    category: first(sp.category),
    status: status === "unregistered" ? undefined : status,
  };

  const [summaryRes, categoriesRes, templatesRes, guestsRes, unregRes] =
    await Promise.all([
      getGuestSummary(),
      getGuestCategories(),
      getMessageTemplates(),
      getGuests({ ...filters, page: tab === "guests" ? page : 1 }),
      getUnregisteredRsvps({ page: tab === "unregistered" ? upage : 1 }),
    ]);

  if (guestsRes.errors || summaryRes.errors) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Tamu</h1>
        <p className="text-muted-foreground">
          {guestsRes.errors?._form[0] ?? summaryRes.errors?._form[0]}
        </p>
      </div>
    );
  }

  return (
    <GuestManager
      tab={tab}
      guests={{
        rows: guestsRes.guests,
        page: guestsRes.page,
        totalPages: guestsRes.totalPages,
        total: guestsRes.total,
      }}
      unregistered={{
        rows: unregRes.errors ? [] : unregRes.rows,
        page: unregRes.errors ? 1 : unregRes.page,
        totalPages: unregRes.errors ? 1 : unregRes.totalPages,
      }}
      summary={summaryRes.summary}
      templates={templatesRes.templates ?? []}
      categories={categoriesRes.categories ?? []}
      invitationSlug={guestsRes.invitationSlug}
      filters={filters}
      searchParams={sp}
      toolbar={<GuestToolbar categories={categoriesRes.categories ?? []} />}
    />
  );
}
