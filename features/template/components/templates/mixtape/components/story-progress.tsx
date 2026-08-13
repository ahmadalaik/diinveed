type StoryProgressProps = {
  total: number;
  index: number;
  paused: boolean;
  onComplete: () => void;
  durationMs?: number;
};

export const DEFAULT_DURATION_MS = 7_000;

export function StoryProgress({
  total,
  index,
  paused,
  onComplete,
  durationMs = DEFAULT_DURATION_MS,
}: StoryProgressProps) {
  return (
    <div
      className="flex gap-1 px-3 pt-3"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-valuetext={`Slide ${index + 1} dari ${total}`}
      aria-label="Kemajuan cerita"
    >
      {Array.from({ length: total }, (_, position) => {
        const state =
          position < index
            ? "complete"
            : position === index
              ? "active"
              : "pending";

        return (
          <span
            key={position}
            data-story-progress-segment
            data-state={state}
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-current/30"
            aria-hidden="true"
          >
            <span
              data-story-progress-fill
              className="absolute inset-0 origin-left rounded-full bg-current"
              style={{
                transform: state === "complete" ? "scaleX(1)" : "scaleX(0)",
                animation:
                  state === "active"
                    ? `mixtape-story-progress-fill ${durationMs}ms linear forwards`
                    : "none",
                animationPlayState: paused ? "paused" : "running",
              }}
              onAnimationEnd={state === "active" ? onComplete : undefined}
            />
          </span>
        );
      })}
    </div>
  );
}
