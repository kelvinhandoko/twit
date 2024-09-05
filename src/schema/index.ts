import { z } from "zod";

export const basicQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .number()
    .min(1, "limitnya 1")
    .max(100, "limit to take data only 100"),
});
