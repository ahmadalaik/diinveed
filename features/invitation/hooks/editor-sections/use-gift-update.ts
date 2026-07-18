import {
  useInvitationStore,
  useInvitationStoreApi,
} from "../../store/invitation-store";
import { GiftTransfer, GiftPackage } from "../../types/invitation.type";

export function useGiftTransferUpdate(id: string) {
  const store = useInvitationStoreApi();
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<GiftTransfer>) => {
    const giftsObj = store.getState().gifts;
    set({
      gifts: {
        ...giftsObj,
        transfers: (giftsObj.transfers || []).map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      },
    });
  };
}

export function useGiftPackageUpdate(id: string) {
  const store = useInvitationStoreApi();
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<GiftPackage>) => {
    const giftsObj = store.getState().gifts;
    set({
      gifts: {
        ...giftsObj,
        packages: (giftsObj.packages || []).map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        ),
      },
    });
  };
}
