import { useInvitationStore } from "../../store/invitation-store";
import { EventItem } from "../../types/invitation.type";

export function useEventUpdate(id: string) {
  const set = useInvitationStore((s) => s.set);
  
  return (patch: Partial<EventItem>) => {
    const events = useInvitationStore.getState().events;
    set({
      events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };
}
