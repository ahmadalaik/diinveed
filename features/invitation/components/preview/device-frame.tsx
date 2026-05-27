"use client";

import { cn } from "@/lib/utils";

type DeviceType = "dekstop" | "tablet" | "mobile";

type DeviceFrameProps = {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
};

const DEVICE_WIDTHS: Record<DeviceType, string> = {
  dekstop: "w-full max-w-4xl",
  tablet: "w-[768px]",
  mobile: "w-[390px]",
};

export function DeviceFrame({ device, children, className }: DeviceFrameProps) {
  return (
    <div
      className={cn(
        "mx-auto rounded-lg border bg-background shadow-lg overflow-auto",
        DEVICE_WIDTHS[device],
        className,
      )}
    >
      {children}
    </div>
  );
}
