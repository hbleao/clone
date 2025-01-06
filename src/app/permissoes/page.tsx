"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import "./styles.scss";

import { AppRole } from "@/lib/permitions";
import { DashboardLayout } from "@/components";

import type { AppMembership, FormData, App, User } from "./types";

export default function PermissoesPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [apps, setApps] = useState<App[]>([]);
	const [memberships, setMemberships] = useState<AppMembership[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData>({
		userId: "",
		appId: "",
		role: AppRole.VIEWER,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const params = useParams();

	const filteredMemberships = memberships.filter((membership) => {
		const userName = membership.user?.name?.toLowerCase() || "";
		const appName = membership.app?.title?.toLowerCase() || "";
		const search = searchTerm.toLowerCase();

		return userName.includes(search) || appName.includes(search);
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersRes, appsRes, membershipsRes] = await Promise.all([
					fetch("/api/users"),
					fetch("/api/apps"),
					fetch("/api/memberships"),
				]);

				if (!usersRes.ok || !appsRes.ok || !membershipsRes.ok) {
					throw new Error("Erro ao carregar dados");
				}

				const [usersData, appsData, membershipsData] = await Promise.all([
					usersRes.json(),
					appsRes.json(),
					membershipsRes.json(),
				]);

				setUsers(usersData);
				setApps(appsData);
				setMemberships(membershipsData);
			} catch (error) {
				setError(error instanceof Error ? error.message : "Erro desconhecido");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/memberships", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erro ao salvar permissão");
			}

			const newMembership = await response.json();
			setMemberships([...memberships, newMembership]);

			setFormData({
				userId: "",
				appId: "",
				role: AppRole.VIEWER,
			});
		} catch (error) {
			setError(error instanceof Error ? error.message : "Erro desconhecido");
		}
	};

	const handleDelete = async (membershipId: string) => {
		try {
			const response = await fetch(`/api/memberships/${membershipId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Erro ao remover permissão");
			}

			setMemberships(memberships.filter((m) => m.id !== membershipId));
		} catch (error) {
			setError(error instanceof Error ? error.message : "Erro desconhecido");
		}
	};

	if (isLoading) return <div>Carregando...</div>;

	return (
		<DashboardLayout slug={params.slug}>
			<div className="permissions-page">
				<div className="header">
					<h1>Gerenciar Permissões</h1>
				</div>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="form-section">
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="userId">Usuário</label>
							<select
								id="userId"
								value={formData.userId}
								onChange={(e) =>
									setFormData({ ...formData, userId: e.target.value })
								}
								required
							>
								<option value="">Selecione um usuário</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="appId">Aplicação</label>
							<select
								id="appId"
								value={formData.appId}
								onChange={(e) =>
									setFormData({ ...formData, appId: e.target.value })
								}
								required
							>
								<option value="">Selecione uma aplicação</option>
								{apps.map((app) => (
									<option key={app.id} value={app.id}>
										{app.title}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="role">Papel</label>
							<select
								id="role"
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value as AppRole })
								}
								required
							>
								{Object.values(AppRole).map((role) => (
									<option key={role} value={role}>
										{role}
									</option>
								))}
							</select>
						</div>
					</div>

					<button type="submit" className="submit-button">
						Adicionar Permissão
					</button>
				</form>

				<div className="search-section">
					<input
						type="text"
						placeholder="Filtrar por nome do usuário ou aplicação..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
				</div>

				<div className="permissions-list">
					<table>
						<thead>
							<tr>
								<th>Usuário</th>
								<th>Aplicação</th>
								<th>Papel</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							{filteredMemberships.map((membership) => (
								<tr key={membership.id}>
									<td>{membership.user?.name || "Usuário não encontrado"}</td>
									<td>{membership.app?.title || "Aplicação não encontrada"}</td>
									<td>
										<span
											className={`role-badge ${membership.role.toLowerCase()}`}
										>
											{membership.role}
										</span>
									</td>
									<td>
										<button
											type="button"
											onClick={() => handleDelete(membership.id)}
											className="delete-button"
										>
											Remover
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</DashboardLayout>
	);
}
