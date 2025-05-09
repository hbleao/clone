import s from "./styles.module.scss";

import type { ButtonProps } from "./types";

export const Button = ({
	type = "button",
	width = "fluid",
	disabled = false,
	className,
	variant = "insurance",
	size = "md",
	onClick,
	children,
	...props
}: ButtonProps) => {
	const isDisabled = disabled ? s.disabled : "";
	return (
		<button
			type={type}
			className={`${s.button} ${s[width]} ${s[variant]} ${s[size]} ${isDisabled} ${className}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};
