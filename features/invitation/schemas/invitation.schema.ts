import z from "zod";

const rsvpOptions = z.object({
  accept: z.boolean(),
  decline: z.boolean(),
  maybe: z.boolean(),
  plusOne: z.boolean(),
});

const eventItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string(),
});

const storyItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  body: z.string(),
});

const giftItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const saveInvitationSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  date: z.string(),
  hosts: z.string(),
  message: z.string(),
  venueName: z.string(),
  venueAddress: z.string(),
  coverImage: z.string().nullable(),
  templateId: z.string(),
  paletteIdx: z.number().int().nullable(),
  fontId: z.string(),
  backgroundType: z.string(),
  dressCode: z.string(),
  rsvpDeadline: z.string(),
  rsvpOptions: rsvpOptions,
  events: z.array(eventItemSchema),
  stories: z.array(storyItemSchema),
  gallery: z.array(z.string()),
  stickers: z.array(z.string()),
  gifts: z.array(giftItemSchema),
});

export type SaveInvitationType = z.infer<typeof saveInvitationSchema>;
