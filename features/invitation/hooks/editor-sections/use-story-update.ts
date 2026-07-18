import {
  useInvitationStore,
  useInvitationStoreApi,
} from "../../store/invitation-store";
import { StoryItem } from "../../types/invitation.type";

export function useStoryUpdate(id: string) {
  const store = useInvitationStoreApi();
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<StoryItem>) => {
    const storiesObj = store.getState().stories;
    set({
      stories: {
        ...storiesObj,
        items: storiesObj.items.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      },
    });
  };
}
