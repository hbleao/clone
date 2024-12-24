"use client";
import Image from "next/image";

import s from "./styles.module.scss";

export const Header = ({ children }: { children?: React.ReactNode }) => {
	return (
		<header className={s.header}>
			<Image
				src="/assets/img/logo_porto.webp"
				alt="Logo"
				width={1000}
				height={1000}
				onClick={() => (window.location.href = "/meus-aplicativos")}
			/>
			{children}
		</header>
	);
};
