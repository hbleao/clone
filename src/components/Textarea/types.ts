export type TextareaProps = {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;
