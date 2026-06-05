import { useInvitationStore } from "../../store/invitation-store";
import { StoryItem } from "../../types/invitation.type";

export function useStoryUpdate(id: string) {
  const set = useInvitationStore((s) => s.set);

  return (patch: Partial<StoryItem>) => {
    const stories = useInvitationStore.getState().stories as StoryItem[];
    set({
      stories: stories.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };
}