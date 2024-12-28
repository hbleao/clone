export type SectionDialogProps = {
	onOpenChange: (open: boolean) => void;
	template: SectionTemplateField;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	defaultValues: Record<string, any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onSave: (data: Record<string, any>) => void;
};
