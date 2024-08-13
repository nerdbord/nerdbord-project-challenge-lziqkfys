import { z } from "zod";

export const FormElementSchema = z.object({
  fieldName: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  type: z.union([
    z.literal("checkbox"),
    z.literal("color"),
    z.literal("email"),
    z.literal("password"),
    z.literal("date"),
    z.literal("number"),
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
  options: z.array(z.object({ option: z.string() })).optional(),
});

export const FormSchema = z.object({
  elements: z.array(FormElementSchema),
});

export type FormType = z.infer<typeof FormSchema>;
export type FormElementType = z.infer<typeof FormElementSchema>;

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
        if (!element.required) {
          fieldSchema = z.boolean().optional();
        }
        break;
      default:
        fieldSchema = z.string();
        if (element.required) {
          fieldSchema = z.string().min(1);
        }
        break;
    }

    schemaShape[element.fieldName] = fieldSchema;
  });

  return z.object(schemaShape);
};
