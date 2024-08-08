import { z } from "zod";

export const FormSchema = z.object({
  elements: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      placeholder: z.string(),
      required: z.boolean(),
      type: z.union([
        z.literal("checkbox"),
        z.literal("color"),
        z.literal("date"),
        z.literal("email"),
        z.literal("file"),
        z.literal("password"),
        z.literal("date"),
        z.literal("number"),
        z.literal("password"),
        z.literal("radio"),
        z.literal("range"),
        z.literal("text"),
        z.literal("time"),
        z.literal("url"),
        z.literal("week"),
        z.literal("month"),
        z.literal("tel"),
        z.literal("date"),
        z.literal("select"),
      ]),
      options: z.array(z.string()).optional(),
    })
  ),
});

export type FormType = z.infer<typeof FormSchema>;
