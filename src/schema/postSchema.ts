import { z } from "zod";
import { basicQuerySchema } from ".";

export const getAllPostQuerySchema = basicQuerySchema.extend({
  authorId: z.string({ required_error: "Author ID is required" }).optional(),
});

export const PostSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  id: z.string().optional(),
});
