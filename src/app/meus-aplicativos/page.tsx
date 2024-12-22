"use client";

import { useState, type FormEvent, useEffect } from "react";
import { createApp, deleteApp, getAllApps, updateApp } from "../../actions/app";
import { getCurrentUser } from "../../actions/auth";
import "./styles.scss";

interface App {
	id: string;
	name: string;
	description?: string;
	owner: string;
	userId: string;
	slug: string;
}

export default function AppsPage() {
	const [apps, setApps] = useState<App[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		owner: "",
		userId: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	// Carregar apps e usuário ao montar o componente
	useEffect(() => {
		const init = async () => {
			const user = await getCurrentUser();
			if (user) {
				setFormData(prev => ({ ...prev, userId: user.id }));
			} else {
				// Redireciona para login se não houver usuário
				window.location.href = "/";
			}
			loadApps();
		};
		
		init();
	}, []);

	// Carregar apps
	const loadApps = async () => {
		const result = await getAllApps();
		if (result.apps) {
			setApps(result.apps);
		}
	};

	// Criar novo app
	const handleCreate = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const result = await createApp(formData);
		if (result.app) {
			loadApps();
			setFormData({ name: "", description: "", owner: "", userId: "" });
		}
		setIsLoading(false);
	};

	// Deletar app
	const handleDelete = async (id: string) => {
		if (confirm("Tem certeza que deseja deletar este app?")) {
			const result = await deleteApp(id);
			if (result.success) {
				loadApps();
			}
		}
	};

	// Atualizar app
	const handleUpdate = async (id: string, data: Partial<App>) => {
		const result = await updateApp(id, data);
		if (result.app) {
			loadApps();
		}
	};

	return (
		<div className="apps-container">
			<h1>Meus Aplicativos</h1>

			{/* Formulário de criação */}
			<div className="form-section">
				<h2>Criar Novo Aplicativo</h2>
				<form onSubmit={handleCreate}>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="name">Nome do App</label>
							<input
								id="name"
								type="text"
								placeholder="Digite o nome do app"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="owner">Proprietário</label>
							<input
								id="owner"
								type="text"
								placeholder="Digite o nome do proprietário"
								value={formData.owner}
								onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="description">Descrição</label>
							<input
								id="description"
								type="text"
								placeholder="Digite uma descrição para o app"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							/>
						</div>
					</div>
					<button type="submit" className="submit-button" disabled={isLoading}>
						{isLoading ? "Criando..." : "Criar Aplicativo"}
					</button>
				</form>
			</div>

			{/* Lista de Apps */}
			<div className="apps-grid">
				{apps.map((app) => (
					<div 
						key={app.id} 
						className="app-card"
						onClick={() => window.location.href = `/meus-aplicativos/${app.slug}`}
					>
						<div className="app-header">
							<div className="app-info">
								<h3>{app.name}</h3>
								<p className="owner">Proprietário: {app.owner}</p>
							</div>
							<div className="actions" onClick={(e) => e.stopPropagation()}>
								<button
									onClick={() => handleDelete(app.id)}
									className="delete-btn"
									title="Deletar"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
								</button>
								<button
									onClick={() => handleUpdate(app.id, {
										name: prompt("Novo nome:", app.name) || app.name,
									})}
									className="edit-btn"
									title="Editar"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
								</button>
							</div>
						</div>
						{app.description && (
							<p className="description">{app.description}</p>
						)}
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
