import { formatDate } from "@/features/invitation/lib/datetime";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { storyYearSpan } from "../lib/stats";
import { ArcStripes } from "../motifs/arc-stripes";
import { DotGrid } from "../motifs/dot-grid";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeStoriesProps = { inv: InvitationState };

export function MixtapeStories({ inv }: MixtapeStoriesProps) {
  const span = storyYearSpan(inv.stories.items);

  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <ArcStripes className="left-0 top-0 h-[20%] w-full" />

      <MixtapeHeading thin="Perjalanan" bold="kami" className="text-3xl" />

      {span ? (
        <p
          className="mt-1 text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]"
          style={{ color: "var(--tpl-text-tertiary)" }}
        >
          {span.from === span.to ? span.from : `${span.from} — ${span.to}`}
        </p>
      ) : null}

      <ol className="mt-5 flex flex-col gap-2.5">
        {inv.stories.items.map((story) => (
          <li key={story.id} className="flex items-baseline gap-2">
            <span
              className="w-10 shrink-0 text-xs font-(family-name:--tpl-font-body)"
              style={{ opacity: 0.7 }}
            >
              {formatDate(story.year, "yyyy")}
            </span>
            <span>
              <span
                className="inline px-1.5 text-lg font-(family-name:--tpl-font-heading) [box-decoration-break:clone]"
                style={{
                  backgroundColor: "var(--tpl-bg-secondary)",
                  color: "var(--tpl-text-secondary)",
                  fontWeight: "var(--tpl-weight-heading)",
                }}
              >
                {story.title}
              </span>
              {story.body ? (
                <span
                  className="mt-1 block text-xs font-(family-name:--tpl-font-body)"
                  style={{ opacity: 0.8 }}
                >
                  {story.body}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>

      <DotGrid className="bottom-[6%] right-[-18%] h-[22%] w-[86%]" />
    </section>
  );
}
