import {
  Alex_Brush,
  Caveat,
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Fira_Code,
  Fraunces,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Inter,
  Josefin_Sans,
  Lora,
  Montserrat,
  Outfit,
  Parisienne,
  Pinyon_Script,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Prata,
  Sacramento,
  Space_Grotesk,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  fallback: ["serif"],
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const prata = Prata({
  subsets: ["latin"],
  variable: "--font-prata",
  weight: "400",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
});
const alexBrush = Alex_Brush({
  subsets: ["latin"],
  variable: "--font-alex",
  weight: "400",
});
const sacramento = Sacramento({
  subsets: ["latin"],
  variable: "--font-sacramento",
  weight: "400",
});
const parisienne = Parisienne({
  subsets: ["latin"],
  variable: "--font-parisienne",
  weight: "400",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-pinyon",
  weight: "400",
});

export const rootFontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  cormorantGaramond.variable,
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
  spaceGrotesk.variable,
].join(" ");
