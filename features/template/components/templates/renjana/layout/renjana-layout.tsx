"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RenjanaLayout({ children }: Props) {
  return (
    <main className="relative w-full h-dvh overflow-y-auto overflow-x-hidden bg-[#d9b7b8] scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="relative mx-auto w-full max-w-md min-h-dvh bg-[#fbf0ef] shadow-2xl shadow-[#6b4a4a]/20 font-(family-name:--font-montserrat) text-[#6b4a4a]">
        {children}
      </div>
    </main>
  );
}
