import type { Metadata } from "next";
import { 
  Cormorant_Garamond, 
  Geist, 
  Geist_Mono, 
  Great_Vibes, 
  Inter, 
  Montserrat,
  Outfit,
  Plus_Jakarta_Sans,
  Lora,
  Fraunces,
  Dancing_Script,
  Caveat,
  Fira_Code,
  Playfair_Display,
  Cinzel,
  Prata,
  Josefin_Sans,
  Alex_Brush,
  Sacramento,
  Parisienne,
  Pinyon_Script
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorantGaramord = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"], fallback: ["serif"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], variable: "--font-script", weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

// New fonts
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

// Invitation-specific fonts
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const prata = Prata({ subsets: ["latin"], variable: "--font-prata", weight: "400" });
const josefin = Josefin_Sans({ subsets: ["latin"], variable: "--font-josefin" });
const alexBrush = Alex_Brush({ subsets: ["latin"], variable: "--font-alex", weight: "400" });
const sacramento = Sacramento({ subsets: ["latin"], variable: "--font-sacramento", weight: "400" });
const parisienne = Parisienne({ subsets: ["latin"], variable: "--font-parisienne", weight: "400" });
const pinyon = Pinyon_Script({ subsets: ["latin"], variable: "--font-pinyon", weight: "400" });

export const metadata: Metadata = {
  title: "diinveed — Undangan Pernikahan Digital",
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
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        cormorantGaramord.variable,
        greatVibes.variable,
        montserrat.variable,
        outfit.variable,
        plusJakarta.variable,
        lora.variable,
        fraunces.variable,
        dancingScript.variable,
        caveat.variable,
        firaCode.variable,
        playfair.variable,
        cinzel.variable,
        prata.variable,
        josefin.variable,
        alexBrush.variable,
        sacramento.variable,
        parisienne.variable,
        pinyon.variable,
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
