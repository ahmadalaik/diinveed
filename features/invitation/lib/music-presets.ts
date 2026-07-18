export type MusicPreset = {
  id: string;
  title: string;
  artist?: string;
  url: string;
};

/**
 * Hardcoded royalty-free background tracks for the invitation editor.
 * The SoundHelix URLs below are publicly streamable placeholders for
 * development — swap them for the project's licensed assets before launch.
 */
export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: "wildfire",
    title: "Wildfire - Jessie Villa",
    url: "https://pub-3f4024c2e27241cd8bb9531a1d174687.r2.dev/asset/music/Wildfire%20-%20Jessie%20Villa.mp3",
  },
  {
    id: "i-love-what-you-do-to-me",
    title: "I Love What You Do To Me - The Soundlings",
    url: "https://pub-3f4024c2e27241cd8bb9531a1d174687.r2.dev/asset/music/I%20Love%20What%20You%20Do%20To%20Me%20-%20The%20Soundlings.mp3",
  },
  {
    id: "warm-strings",
    title: "Warm Strings",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
