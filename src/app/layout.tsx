"use client";

import "../styles/globals.css";

import { DesignerContextProvider } from "@/context";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>
				<DesignerContextProvider>{children}</DesignerContextProvider>
			</body>
		</html>
	);
}
