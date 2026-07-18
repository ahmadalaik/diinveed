import {
  useInvitationStore,
  useInvitationStoreApi,
} from "../../store/invitation-store";
import { EventItem } from "../../types/invitation.type";

export function useEventUpdate(id: string) {
  const store = useInvitationStoreApi();
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<EventItem>) => {
    const events = store.getState().events;
    set({
      events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };
}
