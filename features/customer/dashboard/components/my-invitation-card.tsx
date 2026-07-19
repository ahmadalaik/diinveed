import Link from "next/link";
import { CopyLinkButton } from "./copy-link-button";
import type { DashboardSummary } from "../types/dashboard.type";
import { formatDate } from "@/features/invitation/lib/datetime";
import { Calendar, LinkIcon, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  summary: DashboardSummary;
}

export function MyInvitationCard({ summary }: Props) {
  const { invitation } = summary;
  const isPublished = invitation.isPublished;
  const publicPath = `/${invitation.slug}`;

  const formattedDate =
    formatDate(invitation.nextEventDate || undefined, "PPPP") || "Belum diatur";

  return (
    <div className="double-bezel-outer">
      <div className="double-bezel-inner">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4">
          <div>
            <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase font-semibold">
              STATUS UNDANGAN
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
              {invitation.coupleName || "Belum ada nama pasangan"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isPublished
                ? "Undangan sudah online dan dapat diakses publik"
                : "Lengkapi undangan sebelum mempublikasikannya"}
            </p>
          </div>
          <div>
            {/* Status Badge */}
            {isPublished ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Undangan Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Draf Undangan
              </span>
            )}
          </div>
        </div>

        {/* Mini details container */}
        <div className="my-4 py-3 px-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Tanggal Acara: {formattedDate}</span>
          </div>
          <div className="h-3 w-px bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              Slug: {invitation.slug ? `/${invitation.slug}` : "Belum diatur"}
            </span>
          </div>
        </div>

        {/* Primary CTAs with Button-in-Button Trailing Icon pattern */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-100">
          <Button
            asChild
            className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:bg-primary hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer"
          >
            <Link href="/invitation/edit">
              <span className="relative z-10 transition-all duration-500">
                Lengkapi Undangan
              </span>
              <div className="absolute right-3 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <MoveUpRight size={16} />
              </div>
            </Link>
          </Button>

          {isPublished && (
            <>
              <Button
                asChild
                variant="outline"
                className="px-5 py-3 rounded-full border border-zinc-200 bg-white text-zinc-700 font-medium text-sm hover:bg-zinc-50 hover:text-zinc-950 transition active:scale-[0.98] h-auto"
              >
                <Link href={publicPath} target="_blank" rel="noopener noreferrer">
                  Preview Live
                </Link>
              </Button>
              <CopyLinkButton
                path={publicPath}
                className="px-5 py-3 h-auto rounded-full border border-zinc-200 bg-white text-zinc-700 font-medium text-sm hover:bg-zinc-50 hover:text-zinc-950 transition active:scale-[0.98]"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
