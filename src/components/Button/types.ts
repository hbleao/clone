import type { HTMLAttributes } from "react";

export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	type: "button" | "submit" | "reset";
	width?: "fluid" | "contain";
	variant?: "insurance" | "disabled" | "danger" | "ghost" | "black";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
};
