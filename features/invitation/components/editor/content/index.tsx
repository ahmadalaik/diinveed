import { StudioEditor } from "./content-editor";
import { StudioLivePreview } from "./content-live-preview";

export function StudioContent() {
  return (
    <div className="flex flex-1 overflow-hidden gap-3 md:gap-5 p-3 md:p-5">
      <StudioEditor />
      <StudioLivePreview />
    </div>
  );
}
