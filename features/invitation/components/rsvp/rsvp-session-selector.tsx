"use client";

import type { SessionOption } from "../../events/session.types";

type Props = {
  sessions: SessionOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  className?: string;
  optionClassName?: string;
};

export function RsvpSessionSelector({
  sessions,
  value,
  onChange,
  error,
  className,
  optionClassName,
}: Props) {
  return (
    <fieldset
      className={className}
      aria-describedby={error ? "rsvp-session-error" : undefined}
    >
      <legend>Sesi yang akan dihadiri</legend>
      <div className="space-y-2">
        {sessions.map((session) => {
          const checked = value.includes(session.id);
          return (
            <label key={session.id} className={optionClassName}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  onChange(
                    checked
                      ? value.filter((id) => id !== session.id)
                      : [...value, session.id],
                  )
                }
                aria-label={session.title}
              />
              <span>{session.title}</span>
              {session.isPrimary ? <small>Primary · Public</small> : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id="rsvp-session-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
