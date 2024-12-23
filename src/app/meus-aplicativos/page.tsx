"use client";

import { useState, type FormEvent, useEffect } from "react";
import { createApp, deleteApp, getAllApps, updateApp } from "../../actions/app";
import { getCurrentUser } from "../../actions/auth";

import "./styles.scss";

import type { App } from "./types";
import Image from "next/image";
import { Header, ModalCreateApp } from "@/components";

export default function AppsPage() {
	const [apps, setApps] = useState<App[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		owner: "",
		userId: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const init = async () => {
			const user = await getCurrentUser();
			if (user) {
				setFormData((prev) => ({ ...prev, userId: user.id }));
			} else {
				window.location.href = "/";
			}
			loadApps();
		};

		init();
	}, []);

	const loadApps = async () => {
		const result = await getAllApps();
		if (result.apps) {
			setApps(result.apps);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const result = await createApp(formData);
		if (result.app) {
			loadApps();
			setFormData({ name: "", description: "", owner: "", userId: "" });
			setIsModalOpen(false);
		}
		setIsLoading(false);
	};

	const handleDelete = async (id: string) => {
		if (confirm("Tem certeza que deseja deletar este app?")) {
			const result = await deleteApp(id);
			if (result.success) {
				loadApps();
			}
		}
	};

	const handleUpdate = async (id: string, data: any) => {
		const result = await updateApp(id, data);
		if (result.app) {
			loadApps();
		}
	};

	return (
		<div className="apps-container">
			<Header />
			<div className="header">
				<h1>Meus Aplicativos</h1>
				<button
					type="button"
					className="create-button"
					onClick={() => setIsModalOpen(true)}
				>
					Criar Novo Aplicativo
				</button>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<ModalCreateApp
					setIsModalOpen={setIsModalOpen}
					formData={formData}
					setFormData={setFormData}
					handleSubmit={handleSubmit}
					isLoading={isLoading}
				/>
			)}

			{/* Lista de Apps */}
			<div className="apps-grid">
				{apps.map((app) => (
					<div
						key={app.id}
						className="app-card"
						onClick={() =>
							(window.location.href = `/meus-aplicativos/${app.slug}`)
						}
						onKeyDown={() =>
							(window.location.href = `/meus-aplicativos/${app.slug}`)
						}
					>
						<span className="platform-tag">Hub de Vendas</span>
						<div className="app-header">
							<div className="app-info">
								<h3>{app.name}</h3>
								<p className="description">
									{app.description || "Nenhuma descrição fornecida"}
								</p>
							</div>
							<div
								className="actions"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
							>
								<button
									type="button"
									onClick={() => handleDelete(app.id)}
									className="delete-btn"
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
									onClick={() =>
										handleUpdate(app.id, {
											name: prompt("Novo nome:", app.name) || app.name,
										})
									}
									className="edit-btn"
									title="Editar"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<title>Editar</title>
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
								</button>
							</div>
						</div>
						<div className="app-stats">
							<div className="stat-item">
								<span className="label">Link público</span>
								<span className="value">
									app.portoservicos.com.br/{app.slug}
								</span>
							</div>
							<div className="stat-item">
								<span className="label">Usuários com acesso</span>
								<span className="value">0 usuários</span>
							</div>
							<div className="stat-item">
								<span className="label">Páginas cadastradas</span>
								<span className="value">0 páginas</span>
							</div>
						</div>
						<button type="button" className="trade-now">
							Acessar Aplicativo
						</button>
					</div>
				))}
			</div>
			{apps.length === 0 && (
				<div className="empty-state">
					<p>Nenhum aplicativo encontrado. Crie seu primeiro app!</p>
				</div>
			)}
		</div>
	);
}
