"use client";

import { useState } from "react";
import { MessageSquare, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { SendInvitationDialog } from "./send/send-invitation-dialog";
import type { PageSearchParams } from "@/lib/pagination";

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

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [sendOpen, setSendOpen] = useState(false);

  const setTab = (newTab: "guests" | "unregistered") => {
    const next = new URLSearchParams(params.toString());
    if (newTab === "unregistered") {
      next.set("status", "unregistered");
    } else {
      next.delete("status");
    }
    next.delete("page");
    next.delete("upage");
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="space-y-8 font-outfit">
      {/* Header & Actions */}
      <div className="border-b pb-5 flex flex-col gap-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Daftar Tamu
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Kelola daftar undangan, pantau status kehadiran, dan kirim pesan
              RSVP secara efisien.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Button
              variant="outline"
              className="rounded-full shadow-sm text-[13.5px] font-semibold px-4.5 h-9"
              onClick={() => setSendOpen(true)}
            >
              <Send className="size-3.5 mr-1.5" /> Kirim
            </Button>
            <ManageTemplatesDialog
              templates={templates}
              trigger={
                <Button
                  variant="outline"
                  className="rounded-full shadow-sm text-[13.5px] font-semibold px-4.5 h-9"
                >
                  <MessageSquare className="size-3.5 mr-1.5" /> Template Pesan
                </Button>
              }
            />
            <GuestFormDialog
              mode="create"
              categories={categories}
              trigger={
                <Button className="rounded-full shadow-sm text-[13.5px] font-semibold px-4.5 h-9">
                  <Plus className="size-3.5 mr-1.5" /> Tambah Tamu
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Bento Statistics */}
      <GuestSummaryCard
        summary={summary}
        searchParams={searchParams}
        tab={tab}
      />

      {/* Workspace Block Container (Double Bezel) */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-2 rounded-[2rem] border border-zinc-200/80">
        <div className="bg-background p-6 rounded-[calc(2rem-8px)] shadow-sm border border-black/5">
          {/* Table Tabs */}
          <Tabs
            value={tab}
            onValueChange={(val) => setTab(val as "guests" | "unregistered")}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-[3px] rounded-full gap-[2px]">
                <TabsTrigger
                  value="guests"
                  className="px-4 py-1.5 text-[13px] font-bold rounded-full transition-all duration-200"
                >
                  Semua Tamu ({summary.invited})
                </TabsTrigger>
                <TabsTrigger
                  value="unregistered"
                  className="px-4 py-1.5 text-[13px] font-bold rounded-full transition-all duration-200"
                >
                  Respon Tak Terdaftar ({summary.unregistered})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guests" className="space-y-4 outline-none">
              {toolbar}
              <GuestTable
                guests={guests}
                categories={categories}
                templates={templates}
                invitationSlug={invitationSlug}
                filters={filters}
                searchParams={searchParams}
              />
            </TabsContent>

            <TabsContent
              value="unregistered"
              className="space-y-4 outline-none"
            >
              <UnregisteredResponses
                responses={unregistered.rows}
                page={unregistered.page}
                totalPages={unregistered.totalPages}
                searchParams={searchParams}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SendInvitationDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        templates={templates}
        invitationSlug={invitationSlug}
        filter={filters}
      />
    </div>
  );
}
