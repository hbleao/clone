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
	Shield,
	Users,
	ToyBrick,
} from "lucide-react";

import s from "./styles.module.scss";

import { Header } from "../Header";

export function DashboardLayout({ children, slug }: any) {
	const pathname = usePathname();

	const menuItems = [
		{
			name: "Aplicativos",
			href: "/apps",
			icon: () => <SwatchBook />,
		},
		{
			name: "Páginas",
			href: `/apps/${slug}`,
			icon: () => <BookOpenText />,
		},
		{
			name: "Componentes",
			href: `/apps/${slug}/componentes`,
			icon: () => <ToyBrick />,
		},
		{
			name: "Templates",
			href: `/apps/${slug}/templates`,
			icon: () => <BookCopy />,
		},
		{
			name: "Usuários",
			href: "/usuarios",
			icon: () => <Users />,
		},
		{
			name: "Permissões",
			href: "/permissoes",
			icon: () => <Shield />,
		},
		{
			name: "Analytics",
			href: `/apps/${slug}/analytics`,
			icon: () => <ChartColumn />,
		},
		{
			name: "Configuracões",
			href: "/configuracoes",
			icon: () => <Settings />,
		},
	];

	return (
		<main className={s.dashboardLayout}>
			<aside className={s.aside}>
				<h1 className={s.logo}>HARBOR CMS</h1>
				<nav className={s.nav}>
					{menuItems.map((item) => {
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`
                ${s.navItem} 
                ${isActive ? s.active : ""}
              `}
							>
								{item.icon()}
								<span>{item.name}</span>
							</Link>
						);
					})}
				</nav>
			</aside>
			<div className={s.contentContainer}>
				<div className={s.content}>{children}</div>
			</div>
		</main>
	);
}
