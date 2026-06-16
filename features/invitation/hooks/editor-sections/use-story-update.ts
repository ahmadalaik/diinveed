import { useInvitationStore } from "../../store/invitation-store";
import { StoryItem } from "../../types/invitation.type";

export function useStoryUpdate(id: string) {
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<StoryItem>) => {
    const storiesObj = useInvitationStore.getState().stories;
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
