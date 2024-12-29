"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import s from "./styles.module.scss";

import { Button } from "../Button";
import { getPagesByAppId } from "@/actions/page";

import type { App } from "@/app/apps/types";
import type { ListAppsProps } from "./types";

export const ListApps = ({ apps, handleDelete, handleEdit }: ListAppsProps) => {
	const router = useRouter();
	const [pageCountMap, setPageCountMap] = useState<Record<string, number>>({});

	useEffect(() => {
		const fetchPageCounts = async () => {
			const counts: Record<string, number> = {};
			for (const app of apps) {
				const result = await getPagesByAppId(app.id);
				counts[app.id] = result.success ? result.pages.length : 0;
			}
			setPageCountMap(counts);
		};

		fetchPageCounts();
	}, [apps]);

	return (
		<div className={s["apps-grid"]}>
			{apps.map((app: App) => (
				<div key={app.id} className={s["app-card"]}>
					<span className={s["platform-tag"]}>{app.title}</span>
					<div className={s["app-header"]}>
						<div className={s["app-info"]}>
							<h3>{app.name}</h3>
							<p className={s.description}>
								{app.description || "Nenhuma descrição fornecida"}
							</p>
						</div>
						<div
							className={s.actions}
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className={`${s.button} ${s["delete-btn"]}`}
								onClick={() => handleDelete(app.id)}
								title="Deletar"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<title>Deletar</title>
									<path
										fillRule="evenodd"
										d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
							<button
								type="button"
								className={`${s.button} ${s["edit-btn"]}`}
								onClick={() => handleEdit(app)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Editar</title>
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
								</svg>
							</button>
						</div>
					</div>
					<div className={s["app-stats"]}>
						<div className={s["stat-item"]}>
							<span className={s.label}>Link público</span>
							<span className={s.value}>http://localhost:3000/{app.slug}</span>
						</div>
						<div className={s["stat-item"]}>
							<span className={s.label}>Usuários com acesso</span>
							<span className={s.value}>0 usuários</span>
						</div>
						<div className={s["stat-item"]}>
							<span className={s.label}>Páginas cadastradas</span>
							<span className={s.value}>
								{pageCountMap[app.id] ?? 0} páginas
							</span>
						</div>
					</div>
					<Button
						type="button"
						width="contain"
						onClick={() => router.push(`/apps/${app.slug}`)}
					>
						Acessar páginas
					</Button>
				</div>
			))}
		</div>
	);
};
