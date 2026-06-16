import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type PageSearchParams } from "@/lib/pagination";
import type {
  GuestSummary,
  MessageTemplate,
  UnregisteredRsvp,
} from "../types/guest.type";
import type { GuestFilters } from "../lib/guest-where";
import { GuestFormDialog } from "./guest-form-dialog";
import { ManageTemplatesDialog } from "./message-template/manage-templates-dialog";
import { UnregisteredResponses } from "./unregistered-responses";
import { GuestSummaryCard } from "./guest-summary-card";
import { GuestTable, type GuestList } from "./guest-table";
import { GuestTabs } from "./guest-tabs";

type UnregisteredList = {
  rows: UnregisteredRsvp[];
  page: number;
  totalPages: number;
};

type Props = {
  tab: "guests" | "unregistered";
  guests: GuestList;
  unregistered: UnregisteredList;
  summary: GuestSummary;
  templates: MessageTemplate[];
  categories: string[];
  invitationSlug: string;
  filters: GuestFilters;
  searchParams: PageSearchParams;
  toolbar: React.ReactNode;
};

export function GuestManager(props: Props) {
  const {
    tab,
    guests,
    unregistered,
    summary,
    templates,
    categories,
    invitationSlug,
    filters,
    searchParams,
    toolbar,
  } = props;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:font-normal">
            <span style={{ fontFamily: "var(--font-serif)" }}>
              Daftar <em className="text-primary font-medium not-italic">Tamu</em>
            </span>
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            {summary.invited} tamu · {summary.accepted} hadir · {summary.pending} belum membalas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ManageTemplatesDialog
            templates={templates}
            trigger={
              <Button variant="outline" size="sm">
                <MessageSquare className="size-4" /> Kelola Template
              </Button>
            }
          />
          <GuestFormDialog
            mode="create"
            categories={categories}
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Tambah tamu
              </Button>
            }
          />
        </div>
      </div>

      <GuestSummaryCard summary={summary} />

      <GuestTabs value={tab} searchParams={searchParams} className="space-y-4">
        <TabsList>
          <TabsTrigger value="guests">Daftar Tamu</TabsTrigger>
          <TabsTrigger value="unregistered">Respon tak terdaftar</TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="space-y-4">
          <GuestTable
            guests={guests}
            categories={categories}
            templates={templates}
            invitationSlug={invitationSlug}
            filters={filters}
            searchParams={searchParams}
            toolbar={toolbar}
          />
        </TabsContent>

        <TabsContent value="unregistered">
          <UnregisteredResponses
            responses={unregistered.rows}
            page={unregistered.page}
            totalPages={unregistered.totalPages}
            searchParams={searchParams}
          />
        </TabsContent>
      </GuestTabs>
    </div>
  );
}
