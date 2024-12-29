import s from "./styles.module.scss";

import type { InputProps } from "./types";

export const Input = ({
	label,
	value,
	onChange,
	placeholder,
	...props
}: InputProps) => {
	return (
		<>
			<label className={s.label} htmlFor="title">
				{label}
			</label>
			<input
				id="title"
				className={s.input}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				{...props}
			/>
		</>
	);
};
