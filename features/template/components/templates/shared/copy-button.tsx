"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  value: string;
}

export default function CopyButton({ value, className, ...props }: Props) {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const copyToClipboard = useCallback(async () => {
    try {
      const copied = navigator.clipboard.writeText(value);
      await copied;
      console.log(copied);
      setHasCopied(true);
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
    }
  }, [value]);

  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-2 px-3 py-1 rounded-xl",
        className,
      )}
      onClick={copyToClipboard}
      {...props}
    >
      <Check
        strokeWidth={1.5}
        className={cn(
          "absolute size-3 transition-all duration-300",
          hasCopied ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      />

      <Copy
        strokeWidth={1.5}
        className={cn(
          "size-3 transition-all duration-300",
          hasCopied ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      />
      <span
        className={cn(
          "transition-all duration-300",
          hasCopied ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      >
        Salin
      </span>
    </button>
  );
}
