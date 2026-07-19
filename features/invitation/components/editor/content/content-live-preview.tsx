import { LivePreview } from "./live-preview";

export function StudioLivePreview() {
  return (
    <div className="hidden md:flex flex-1 min-w-0 h-full">
      <LivePreview />
    </div>
  );
}
