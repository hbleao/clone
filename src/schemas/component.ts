import { z } from "zod";

const fieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const fieldSchema = z.object({
  name: z.string(),
  type: z.enum([
    "text",
    "textarea",
    "wysiwyg",
    "number",
    "select",
    "image",
    "object",
    "array",
    "date",
    "datetime",
    "time",
    "boolean",
  ]),
  label: z.string(),
  required: z.boolean().optional(),
  options: z.array(fieldOptionSchema).optional(),
});

const schemaSchema = z.object({
  fields: z.array(fieldSchema),
});

export const componentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["hero", "features", "testimonials", "custom"]),
  description: z.string().min(1, "Descrição é obrigatória"),
  schema: schemaSchema.optional(),
  defaultData: z.record(z.any()).optional(),
});
