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
    id: "soft-romance",
    title: "Soft Romance",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "gentle-piano",
    title: "Gentle Piano",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "warm-strings",
    title: "Warm Strings",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
