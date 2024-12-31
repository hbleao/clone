"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
	SwatchBook,
	Notebook,
	BookOpenText,
	BookCopy,
	Settings,
	ChartColumn,
} from "lucide-react";

import styles from "./styles.module.scss";

export default function Sidebar() {
	const pathname = usePathname();
	const params = useParams();

	const menuItems = [
		{
			name: "Aplicativos",
			href: "/apps",
			icon: () => <SwatchBook />,
		},
		{
			name: "Páginas",
			href: "/apps/",
			icon: () => <BookOpenText />,
		},
		{
			name: "Seções",
			href: "/sections",
			icon: () => <Notebook />,
		},
		{
			name: "Templates",
			href: "/templates",
			icon: () => <BookCopy />,
		},
		{
			name: "Usuários",
			href: "/usuarios",
			icon: () => (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
			),
		},
		{
			name: "Permissões",
			href: "/permissoes",
			icon: () => (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
			),
		},
		{
			name: "Analytics",
			href: "/analytics",
			icon: () => <ChartColumn />,
		},
		{
			name: "Configuracões",
			href: "/configuracoes",
			icon: () => <Settings />,
		},
		{
			name: "Teste",
			href: "/test",
			icon: () => (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
					/>
				</svg>
			),
		},
	];

	return (
		<aside className={styles.sidebar}>
			<h1 className={styles.logo}>HARBOR CMS</h1>
			<nav className={styles.nav}>
				{menuItems.map((item) => {
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`
                ${styles.navItem} 
                ${isActive ? styles.active : ""}
              `}
						>
							{item.icon()}
							<span>{item.name}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
