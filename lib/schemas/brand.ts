import { z } from "zod";

export const Brand = z.object({
  id: z.number().int().min(1),
  name: z.string().min(1),
});

export type Brand = z.infer<typeof Brand>;
