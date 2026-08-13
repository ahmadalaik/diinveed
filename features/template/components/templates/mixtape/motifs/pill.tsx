import type { ReactNode } from "react";

type MixtapePillProps = {
  as?: "button" | "span";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Pill outline. Border memakai `currentColor`, sehingga cukup mewarisi
 * warna teks dari permukaan — tidak butuh slot border di TemplateTokens.
 */
export function MixtapePill({
  as = "span",
  onClick,
  children,
  className,
}: MixtapePillProps) {
  const classes = `inline-block rounded-full border border-current px-5 py-2.5 text-xs font-semibold tracking-[0.17em] font-(family-name:--tpl-font-body) bg-(--tpl-bg-secondary) text-(--tpl-text-secondary) cursor-pointer ${className ?? ""}`;

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
