import s from "./styles.module.scss";

import type { TextareaProps } from "./types";

export const Textarea = ({
	label,
	value,
	onChange,
	...props
}: TextareaProps) => {
	return (
		<>
			<label className={s.label} htmlFor="description">
				{label}
			</label>
			<textarea
				id="description"
				className={s.textarea}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				{...props}
			/>
		</>
	);
};
