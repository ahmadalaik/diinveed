import z from "zod";

export const wishesOptionsSchema = z.object({
  enabled: z.boolean(),
  reviewMode: z.boolean(),
  allowPublic: z.boolean(),
  showCategory: z.boolean(),
});

export type WishesOptionsType = z.infer<typeof wishesOptionsSchema>;

export const DEFAULT_WISHES_OPTIONS: WishesOptionsType = {
  enabled: true,
  reviewMode: false,
  allowPublic: true,
  showCategory: false,
};

export const moderateWishSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "hide", "show"]),
});

export type ModerateWishType = z.infer<typeof moderateWishSchema>;
