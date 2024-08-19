import { z } from "zod";

export const formElementVariants = [
  "checkbox",
  "color",
  "email",
  "password",
  "date",
  "number",
  "range",
  "text",
  "time",
  "url",
  "tel",
  "select",
];

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
  webhookUrl: z.string().url().nullable(),
  createdAt: z.union([z.string(),z.date()]).nullable()
});

export type FormType = z.infer<typeof FormSchema>;
export type FormElementType = z.infer<typeof FormElementSchema>;

export const generateSchema = (form: FormType) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
    form.formData.forEach((element) => {      
    let fieldSchema: z.ZodTypeAny;

    switch (element.type) {
      case "number":
      case "tel":
        fieldSchema = z.coerce.number();
        if (element.required) {
          fieldSchema = z.coerce.number().min(1);
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
