"use client";

import "../styles/globals.css";

import { PageBuilderContextProvider } from "@/context";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>
				<PageBuilderContextProvider>{children}</PageBuilderContextProvider>
			</body>
		</html>
	);
}
