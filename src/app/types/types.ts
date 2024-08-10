import { z } from "zod";

export const FormSchema = z.object({
  elements: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean(),
      type: z.union([
        z.literal("checkbox"),
        z.literal("color"),
        z.literal("date"),
        z.literal("email"),
        z.literal("password"),
        z.literal("date"),
        z.literal("number"),
        z.literal("password"),
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

export const generateSchema = (formData: FormType) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  formData.elements.forEach((element) => {
    let fieldSchema: z.ZodTypeAny;

    switch (element.type) {
      case "number":
        fieldSchema = z.number();
        if (element.required) {
          fieldSchema = z.number().min(1);
        }
        break;
      case "checkbox":
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
        if (element.required) {
          fieldSchema = z.string().min(1);
        }
        break;
    }

    schemaShape[element.name] = fieldSchema;
  });

  return z.object(schemaShape);
};
