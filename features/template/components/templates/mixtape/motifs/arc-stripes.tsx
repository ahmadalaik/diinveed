interface ArcStripesProps {
  className?: string;
}

/** Busur konsentris berwarna aksen sebagai penutup kepala kartu. */
export function ArcStripes({ className }: ArcStripesProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 34"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className ?? ""}`}
    >
      <g fill="none" stroke="var(--tpl-bg-tertiary)" strokeWidth="5">
        <path
          d="M-10 40C6 8 40 -2 70 6"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur="1s"
            begin="0s"
            fill="freeze"
          />
        </path>
        <path
          d="M-10 54C8 16 46 4 78 14"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur="1s"
            begin="0.15s"
            fill="freeze"
          />
        </path>
        <path
          d="M-10 68C10 24 52 10 86 22"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur="1s"
            begin="0.3s"
            fill="freeze"
          />
        </path>
      </g>
    </svg>
  );
}
