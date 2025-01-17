import type { DetailedHTMLProps, HTMLAttributes } from "react";
import s from "./styles.module.scss";

export type SwitchProps = Omit<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	"onChange"
> & {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	size?: "sm" | "md";
	width?: "fluid" | "contain";
};

export const Switch = ({
	size = "sm",
	width = "contain",
	checked = false,
	onCheckedChange,
	...props
}: SwitchProps) => {
	const containerClass = checked ? s.switchChecked : s.switchNoChecked;
	const circleClass = checked ? s.checked : s.noChecked;

	const handleClick = () => {
		onCheckedChange?.(!checked);
	};

	return (
		<div
			className={`${s.switch} ${s[size]} ${s[width]} ${containerClass}`}
			onClick={handleClick}
			onKeyDown={handleClick}
			aria-checked={checked}
			{...props}
		>
			<span className={`${s.circle} ${circleClass}`} />
		</div>
	);
};
