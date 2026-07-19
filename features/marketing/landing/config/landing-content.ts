export type WhatsappSource = "hero" | "template" | "pricing" | "final-cta";

export interface ShowcaseTemplate {
  readonly slug: string;
  readonly name: string;
  readonly mood: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
  readonly href: `/preview/${string}`;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const marketingConfig = {
  whatsappNumber: "6281122334455",
} as const;

export const showcaseTemplates = [
  {
    slug: "kalandra",
    name: "Kalandra",
    mood: "Editorial · Hangat",
    description: "Komposisi tenang dengan detail klasik yang tidak berlebihan.",
    image: "/marketing/landing/template-kalandra.jpg",
    alt: "Pratinjau undangan digital Kalandra dengan komposisi editorial hangat",
    href: "/preview/kalandra",
  },
  {
    slug: "adhikari",
    name: "Adhikari",
    mood: "Klasik · Intim",
    description: "Ritme serif yang anggun untuk perayaan yang terasa dekat.",
    image: "/marketing/landing/template-adhikari.jpg",
    alt: "Pratinjau undangan digital Adhikari bernuansa klasik dan intim",
    href: "/preview/adhikari",
  },
  {
    slug: "dikara",
    name: "Dikara",
    mood: "Fotografis · Dramatis",
    description: "Foto menjadi pusat cerita dengan lapisan tipografi yang bersih.",
    image: "/marketing/landing/template-dikara.jpg",
    alt: "Pratinjau undangan digital Dikara dengan fotografi besar dan dramatis",
    href: "/preview/dikara",
  },
  {
    slug: "arunika",
    name: "Arunika",
    mood: "Botanikal · Lembut",
    description: "Aksen bunga yang terukur dengan alur baca yang ringan.",
    image: "/marketing/landing/template-arunika.jpg",
    alt: "Pratinjau undangan digital Arunika dengan aksen botanikal yang lembut",
    href: "/preview/arunika",
  },
] as const satisfies readonly ShowcaseTemplate[];

export const landingContent = {
  hero: {
    eyebrow: "Undangan pernikahan digital",
    title: "Abadikan cerita kalian dalam undangan yang indah.",
    description:
      "Buat sendiri dengan mudah, atau biarkan tim diinveed membantu menyiapkannya.",
    primaryCta: "Pesan via WhatsApp",
    secondaryCta: "Lihat template",
  },
  offer: {
    name: "Paket Lengkap",
    price: 149_000,
    priceLabel: "Rp149.000",
    paymentLabel: "Sekali bayar",
    activeMonths: 12,
    inclusions: [
      "Aktif selama 12 bulan",
      "Akses semua template siap pakai",
      "Editor mandiri setelah akun diterima",
      "Bantuan isi konten awal",
      "Dukungan melalui WhatsApp",
    ],
  },
  orderSteps: [
    "Pilih desain yang paling sesuai",
    "Hubungi diinveed melalui WhatsApp",
    "Selesaikan pembayaran manual",
    "Terima akun yang sudah diaktifkan",
    "Lengkapi, periksa, lalu bagikan undangan",
  ],
  faqs: [
    {
      question: "Bagaimana proses pembayarannya?",
      answer:
        "Setelah memilih template, hubungi kami melalui WhatsApp. Admin akan mengirimkan detail pembayaran dan mengonfirmasi pembayaran secara manual.",
    },
    {
      question: "Kapan akun saya diterima?",
      answer:
        "Admin membuat dan mengirimkan akun setelah pembayaran dikonfirmasi. Waktu pengerjaan akan diinformasikan langsung dalam percakapan WhatsApp.",
    },
    {
      question: "Apakah saya harus mengisi semuanya sendiri?",
      answer:
        "Tidak. Pengisian konten awal oleh admin sudah termasuk. Kirimkan materi yang diperlukan, lalu Anda tetap dapat mengubahnya sendiri setelah akun diterima.",
    },
    {
      question: "Apakah template dapat diganti?",
      answer:
        "Pilihan template dibicarakan bersama admin sebelum penyiapan akun agar hasil awal sesuai dengan kebutuhan kalian.",
    },
    {
      question: "Berapa lama undangan aktif?",
      answer: "Undangan aktif selama 12 bulan sejak akun diaktifkan.",
    },
    {
      question: "Apakah undangan dapat diedit setelah dibagikan?",
      answer:
        "Ya. Perubahan tersimpan pada tautan yang sama sehingga kalian tidak perlu membagikan ulang tautannya.",
    },
  ] satisfies readonly FaqItem[],
} as const;
