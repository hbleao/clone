"use client";

import { Toaster } from "sonner";
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
				<Toaster />
				<PageBuilderContextProvider>{children}</PageBuilderContextProvider>
			</body>
		</html>
	);
}
