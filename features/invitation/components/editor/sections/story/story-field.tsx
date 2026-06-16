"use client";

import { useStoryUpdate } from "@/features/invitation/hooks/editor-sections/use-story-update";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../../editor-field";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";

export function StoryEnabledField() {
  const stories = useInvitationStore((s) => s.stories);
  const isEnabled = useInvitationStore((s) => s.stories.enabled);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField className="flex-row">
      <EditorLabel htmlFor="is-story-enabled">Tampilkan Story</EditorLabel>
      <Switch
        id="story-enabled"
        checked={isEnabled}
        onCheckedChange={() =>
          set({ stories: { ...stories, enabled: !isEnabled } })
        }
      />
    </EditorField>
  );
}

export function StoryYearField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.stories.items.find((e) => e.id === id)?.year ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-year-${id}`}>Tanggal</EditorLabel>
      <DatePicker
        id={`story-year-${id}`}
        value={value}
        onChange={(year) => update({ year })}
        yearsBack={10}
        yearsForward={1}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
    </EditorField>
  );
}

export function StoryTitleField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.stories.items.find((e) => e.id === id)?.title ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-title-${id}`}>Event</EditorLabel>
      <EditorInput
        id={`story-title-${id}`}
        autoComplete="off"
        placeholder="Pertama Bertemu"
        value={value}
        onChange={(e) => update({ title: e.target.value })}
      />
    </EditorField>
  );
}

export function StoryDescriptionField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.stories.items.find((e) => e.id === id)?.body ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-desc-${id}`}>Story</EditorLabel>
      <EditorTextarea
        id={`story-desc-${id}`}
        placeholder="Berawal dari teman kuliah dan kebetulan satu organisasi.."
        value={value}
        onChange={(e) => update({ body: e.target.value })}
      />
    </EditorField>
  );
}
