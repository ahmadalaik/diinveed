import type { Metadata } from "next";
import { ComingSoon } from "@/features/marketing/components/coming-soon";

export const metadata: Metadata = {
  title: "Onestoria — Undangan Pernikahan Digital yang Personal",
  description:
    "Abadikan cerita kalian dalam undangan digital yang indah. Satu paket lengkap, editor mandiri, dan bantuan pengisian konten awal.",
};

export default function Home() {
  return <ComingSoon />;
}
