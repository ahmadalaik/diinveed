import type { EventItem } from "../types/invitation.type";

export type EditorEventItem = EventItem & {
  position: number;
  isPrimary: boolean;
  pendingDeletion: boolean;
  replacementEventId: string | null;
  live: boolean;
};

export type SessionDraftInput = Omit<EditorEventItem, "live">;

export type SessionOption = {
  id: string;
  title: string;
  isPrimary: boolean;
  position: number;
};
