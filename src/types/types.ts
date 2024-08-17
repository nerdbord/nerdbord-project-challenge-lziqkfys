import { z } from "zod";

export const FormElementSchema = z.object({
  fieldName: z.string(),
  label: z.string(),
  placeholder: z.string().nullable(),
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
  options: z.array(z.object({ option: z.string() })).nullable(),
});

export const FormSchema = z.object({
  id: z.number(),
  formId: z.string(),
  formName: z.string().nullable(),
  formData: z.array(FormElementSchema),
  userId: z.string().nullable(),
  webhookUrl: z.string().nullable(),
  createdAt: z.string().nullable(),
});

export type FormType = z.infer<typeof FormSchema>;
export type FormElementType = z.infer<typeof FormElementSchema>;

export const generateSchema = (form: FormType) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  // Array.from(form.formData).forEach((element) => {
    form.formData.forEach((element) => {
    let fieldSchema: z.ZodTypeAny;

    switch (element.type) {
      case "number":
      case "tel":
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
