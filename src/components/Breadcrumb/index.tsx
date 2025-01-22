"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./styles.module.scss";

interface BreadcrumbProps {
	homeLabel?: string;
	separator?: string;
}

export function Breadcrumb({
	homeLabel = "Home",
	separator = "/",
}: BreadcrumbProps) {
	const pathname = usePathname();

	// Split the pathname and filter out empty segments
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");

	// Generate breadcrumb items
	const breadcrumbItems = [
		{ label: homeLabel, href: "/" },
		...pathSegments.map((segment, index) => ({
			label:
				segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
			href: `/${pathSegments.slice(0, index + 1).join("/")}`,
		})),
	];

	return (
		<nav aria-label="Breadcrumb" className={styles.breadcrumb}>
			<ol>
				{breadcrumbItems.map((item, index) => (
					<li key={item.href}>
						{index === breadcrumbItems.length - 1 ? (
							<span className={styles.current}>{item.label}</span>
						) : (
							<Link href={item.href} className={styles.link}>
								{item.label}
							</Link>
						)}
						{index < breadcrumbItems.length - 1 && (
							<span className={styles.separator}>{separator}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
