import NextLink from "next/link";

import s from "./styles.module.scss";

import type { LinkProps } from "./types";

export const Link = ({
	width = "fluid",
	disabled = false,
	variant = "insurance",
	href,
	children,
	...props
}: LinkProps) => {
	const isDisabled = disabled ? s.disabled : "";
	return (
		<NextLink
			href={href}
			className={`${s.link} ${s[width]} ${s[variant]} ${isDisabled}`}
			{...props}
		>
			{children}
		</NextLink>
	);
};
