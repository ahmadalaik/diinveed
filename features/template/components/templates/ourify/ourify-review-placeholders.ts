export type OurifyReviewPalette = {
  id: "classic" | "rose" | "ocean";
  label: string;
  accent: `#${string}`;
  verse: `#${string}`;
};

export type OurifyReviewWish = {
  id: string;
  name: string;
  wish: string;
  response: "ACCEPT" | "DECLINE" | "MAYBE";
};

export type OurifyReviewPlaceholders = {
  socials: {
    bride: string;
    groom: string;
  };
  hashtagOverride: string | null;
  video: {
    url: string;
    poster: string | null;
    title: string;
  };
  providerMarks: Readonly<Record<string, string>>;
  palettes: readonly OurifyReviewPalette[];
  dressCodeSwatches: readonly {
    name: string;
    value: `#${string}`;
  }[];
  wishes: readonly OurifyReviewWish[];
  introCopy: string;
  galleryQuote: string;
  closingCopy: string;
  footerLinks: {
    instagram: string;
    website: string;
  };
};

export const OURIFY_REVIEW_PLACEHOLDERS =
  Object.freeze<OurifyReviewPlaceholders>({
    socials: {
      bride: "@ourifybride",
      groom: "@ourifygroom",
    },
    hashtagOverride: null,
    video: {
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      poster: null,
      title: "Our Story in Motion",
    },
    providerMarks: {
      BCA: "BCA",
      BNI: "BNI",
      BRI: "BRI",
      MANDIRI: "mandiri",
    },
    palettes: [
      {
        id: "classic",
        label: "Classic green",
        accent: "#1db954",
        verse: "#1db954",
      },
      {
        id: "rose",
        label: "Rose",
        accent: "#e45b80",
        verse: "#e45b80",
      },
      {
        id: "ocean",
        label: "Ocean",
        accent: "#3c8fd6",
        verse: "#3c8fd6",
      },
    ],
    dressCodeSwatches: [
      { name: "Ivory", value: "#f2eadf" },
      { name: "Sand", value: "#cbb79d" },
      { name: "Sage", value: "#87937a" },
      { name: "Espresso", value: "#4b382f" },
    ],
    wishes: [
      {
        id: "review-wish-1",
        name: "Nadia",
        wish: "Semoga selalu menjadi rumah bagi satu sama lain.",
        response: "ACCEPT",
      },
      {
        id: "review-wish-2",
        name: "Raka",
        wish: "Selamat memulai cerita terbaik kalian.",
        response: "MAYBE",
      },
    ],
    introCopy: "A new chapter is about to play.",
    galleryQuote: "Every love story has a rhythm of its own.",
    closingCopy:
      "Thank you for listening to our story. It means the world to celebrate this day with you, the people who make our favorite memories.",
    footerLinks: {
      instagram: "https://www.instagram.com/onestoria",
      website: "https://onestoria.com",
    },
  });
