import s from "./styles.module.scss";

import type { InputProps } from "./types";

export const Input = ({
	label,
	value,
	onChange,
	placeholder,
	id,
	...props
}: InputProps) => {
	return (
		<>
			<label className={s.label} htmlFor={id}>
				{label}
			</label>
			<input
				id={id}
				className={s.input}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
				{...props}
			/>
		</>
	);
};
