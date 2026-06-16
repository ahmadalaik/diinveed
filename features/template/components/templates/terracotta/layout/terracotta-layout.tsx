"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function TerracottaLayout({ children }: Props) {
  return (
    <main className="fixed right-0 top-0 w-full lg:w-[30%] h-svh overflow-y-auto overflow-x-hidden bg-richblack text-ivory scroll-smooth z-10 scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="relative z-0">{children}</div>
    </main>
  );
}
