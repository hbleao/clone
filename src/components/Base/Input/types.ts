export type InputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange"
> & {
	label: string;
	onChange: (value: string) => void;
	value?: string;
};
