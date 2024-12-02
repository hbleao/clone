type TextareaProps = {
	label: string;
	placeholder: string;
	className?: string;
	rows: string;
	maxChars?: number;
	helperText?: string;
	errorMessage?: string;
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
};
