"use client";

import { useEffect, useState } from "react";
import { deleteApp, getAllApps, updateApp } from "../../actions/app";

import "./styles.scss";

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
		const result = await getAllApps();
		setApps(result.apps);
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
		if (result.success) {
			loadApps();
			setIsEditModalOpen(false);
			setSelectedApp(null);
		}
	};

	const handleEdit = (app: App) => {
		setSelectedApp(app);
		setIsEditModalOpen(true);
	};

	useEffect(() => {
		loadApps();
	}, []);

	return (
		<div className="apps-container">
			<Header />
			<div className="header">
				<h1 className={"header-title"}>Meus Aplicativos</h1>
				<Button
					width="contain"
					type="button"
					onClick={() => setIsModalOpen(true)}
				>
					Criar Novo Aplicativo
				</Button>
			</div>
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
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							handleUpdate({
								title: formData.get("title") as string,
								name: formData.get("name") as string,
								description: formData.get("description") as string,
							});
						}}
						className="form"
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
								value={selectedApp.description}
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

			<ListApps
				apps={apps}
				handleDelete={handleDelete}
				handleEdit={handleEdit}
			/>
			{apps.length === 0 && (
				<div className="empty-state">
					<p>Nenhum aplicativo encontrado. Crie seu primeiro app!</p>
				</div>
			)}
		</div>
	);
}
