import { useInvitationStore } from "../../store/invitation-store";
import { GiftItem } from "../../types/invitation.type";

export function useGiftUpdate(id: string) {
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<GiftItem>) => {
    const gifts = useInvitationStore.getState().gifts as GiftItem[];
    set({ gifts: gifts.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  };
}
