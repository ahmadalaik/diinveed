import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { rootFontVariables } from "@/lib/fonts";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Onestoria — Undangan Pernikahan Digital",
  description:
    "Buat undangan pernikahan digital yang elegan dalam hitungan menit. Pilih template, sesuaikan, lalu bagikan ke seluruh tamu Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        rootFontVariables,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
