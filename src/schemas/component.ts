import { z } from "zod";

const componentTypeSchema = z.enum([
	"hero",
	"features",
	"testimonials",
	"custom",
	"card",
]);

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
		"object",
		"array",
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
	name: z
		.string()
		.min(2, "Nome do componente deve ter pelo menos 2 caracteres"),
	type: componentTypeSchema,
	description: z.string().min(1, "Descrição é obrigatória"),
	schema: schemaSchema.optional(),
	defaultData: z.record(z.any()).optional(),
});
