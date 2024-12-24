"use client";

import { useEffect, useState } from "react";
import { FolderPlus, Plus } from "lucide-react";

import "./styles.scss";

import { deleteApp, getAllApps, updateApp } from "../../actions/app";

import {
	Dialog,
	Header,
	FormCreateApp,
	Input,
	Textarea,
	Button,
	ListApps,
} from "@/components";

import type { App } from "./types";

export default function AppsPage() {
	const [apps, setApps] = useState<App[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedApp, setSelectedApp] = useState<App | null>(null);

	const loadApps = async () => {
		const response = await getAllApps();
		if (response?.apps) {
			setApps(response.apps);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Tem certeza que deseja deletar este app?")) {
			const result = await deleteApp(id);
			if (result.success) {
				loadApps();
			}
		}
	};

	const handleUpdate = async (data: {
		title: string;
		name: string;
		description?: string;
	}) => {
		if (!selectedApp) return;

		const result = await updateApp(selectedApp.id, data);
		if (result.app) {
			loadApps();
			setIsEditModalOpen(false);
			setSelectedApp(null);
		}
	};

	const handleEdit = (app: App) => {
		setSelectedApp(app);
		setIsEditModalOpen(true);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadApps();
	}, []);

	return (
		<div className="apps-container">
			<Header />
			<div className="content">
				<div className="header">
					<h1>Meus Aplicativos</h1>
					<Button
						type="button"
						width="contain"
						onClick={() => setIsModalOpen(true)}
					>
						<Plus />
						Novo aplicativo
					</Button>
				</div>

				{apps.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">
							<FolderPlus size={48} />
						</div>
						<h2>Nenhum aplicativo encontrado</h2>
						<p>
							Comece criando seu primeiro aplicativo clicando no botão acima
						</p>
					</div>
				) : (
					<ListApps
						apps={apps}
						handleDelete={handleDelete}
						handleEdit={handleEdit}
					/>
				)}

				{isModalOpen && (
					<Dialog
						title="Criar novo aplicativo"
						handleCloseModal={() => setIsModalOpen(false)}
					>
						<FormCreateApp setIsModalOpen={setIsModalOpen} />
					</Dialog>
				)}
				{isEditModalOpen && selectedApp && (
					<Dialog
						title={`Editar Aplicativo (${selectedApp?.name})`}
						handleCloseModal={() => {
							setIsEditModalOpen(false);
							setSelectedApp(null);
						}}
					>
						<form
							className="form"
							onSubmit={async (e) => {
								e.preventDefault();
								if (!selectedApp) return;
								await handleUpdate({
									title: selectedApp.title,
									name: selectedApp.name,
									description: selectedApp.description || undefined,
								});
							}}
						>
							<div className="form-group">
								<Input
									label="Organização"
									value={selectedApp.title}
									onChange={(value: string) => {
										setSelectedApp((prev) => {
											if (!prev) return null;
											return {
												...prev,
												title: value,
											};
										});
									}}
								/>
							</div>
							<div className="form-group">
								<Input
									label="Nome"
									value={selectedApp.name}
									onChange={(value: string) => {
										setSelectedApp((prev) => {
											if (!prev) return null;
											return {
												...prev,
												name: value,
											};
										});
									}}
								/>
							</div>
							<div className="form-group">
								<Textarea
									label="Descrição"
									value={selectedApp?.description ?? ""}
									onChange={(value: string) => {
										setSelectedApp((prev) => {
											if (!prev) return null;
											return {
												...prev,
												description: value,
											};
										});
									}}
								/>
							</div>
							<Button type="submit">Atualizar</Button>
						</form>
					</Dialog>
				)}
			</div>
		</div>
	);
}
