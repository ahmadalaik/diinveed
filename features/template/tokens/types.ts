export type BorderRadius = "minimal" | "rounded" | "pill";

export type InvitationToken = {
  theme: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  borderRadius: BorderRadius;
};

export type TokenOverrides = {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
  };
  borderRadius?: BorderRadius;
};

/* -------------------------------------------------------------------------- */
/*  Template design tokens (per-template)                                     */
/*                                                                            */
/*  Layer terpisah dari `InvitationToken` (model lama). Bentuknya mengikuti   */
/*  model "Ubah Desain" Katsudoto: warna 3 tier (Primary/Secondary/Tertiary)  */
/*  + typography 2 grup (Heading/Body) dengan jenis/ukuran/ketebalan/         */
/*  kapitalisasi. Inilah bagian yang diekspos & diubah user lewat editor.     */
/*                                                                            */
/*  Ref: [[reference-katsudoto-ubah-desain]]                                  */
/* -------------------------------------------------------------------------- */

/** Kapitalisasi teks (memetakan CSS `text-transform`). */
export type TextTransform = "none" | "uppercase" | "capitalize" | "lowercase";

/** Spesifikasi satu grup font, mengikuti parameter Katsudoto. */
export type FontSpec = {
  /** Keluarga font — CSS variable (mis. "var(--font-serif)") atau nama font. */
  family: string;
  /** Ukuran dasar (mis. "1rem"); skala antar elemen tetap relatif terhadap ini. */
  size: string;
  /** Ketebalan font (100–900). */
  weight: number;
  /** Kapitalisasi. */
  transform: TextTransform;
};

/** Warna brand — 3 tier semantik ala Katsudoto. Diterapkan ke bg, teks, button. */
export type TemplateColorTokens = {
  /** Warna paling dominan di desain. */
  primary: string;
  /** Warna kedua; tampil lebih sedikit dari primary. */
  secondary: string;
  /** Warna yang paling sedikit muncul. */
  tertiary: string;
};

/**
 * Typography — grup font template. Mengikuti Katsudoto (heading + body), plus
 * slot `display` untuk font script/kaligrafi (mis. nama mempelai) yang tak
 * cocok dengan parameter ketebalan/kapitalisasi font heading biasa.
 */
export type TemplateTypographyTokens = {
  /** Font display/kaligrafi — judul utama, nama mempelai. */
  display: FontSpec;
  /** Judul & subjudul. */
  heading: FontSpec;
  /** Teks badan/deskripsi. */
  body: FontSpec;
};

/** Bagian desain template yang bisa diedit user (model Katsudoto). */
export type TemplateTokens = {
  /** Slug template, mis. "kelana". */
  template: string;
  /** Nama tampil. */
  name: string;
  colors: TemplateColorTokens;
  typography: TemplateTypographyTokens;
};

/**
 * Override per-undangan terhadap `TemplateTokens` base. Disimpan di kolom JSON
 * `tokenOverrides`; hanya field yang diubah user yang ada di sini, sisanya
 * jatuh ke nilai base saat di-merge.
 */
export type TemplateTokenOverrides = {
  colors?: Partial<TemplateColorTokens>;
  typography?: {
    display?: Partial<FontSpec>;
    heading?: Partial<FontSpec>;
    body?: Partial<FontSpec>;
  };
};
