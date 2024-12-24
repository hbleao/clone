import type { LinkProps as NextLinkProps } from "next/link";
import type { HTMLAttributes } from "react";

export type LinkProps = NextLinkProps & {
	children: React.ReactNode;
	width?: "fluid" | "contain";
	variant?: "insurance" | "disabled" | "danger" | "ghost";
	disabled?: boolean;
};
