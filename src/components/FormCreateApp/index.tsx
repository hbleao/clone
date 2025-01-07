"use client";

import { type FormEvent, useEffect, useState } from "react";
import { getCurrentUser } from "@/actions/auth";
import { createApp } from "@/actions/app";

import { Button, Input, Textarea } from "@/components";
import s from "./styles.module.scss";

export const FormCreateApp = ({
	setIsModalOpen,
}: {
	setIsModalOpen: (value: boolean) => void;
}) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		owner: "",
		title: "",
		userId: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadUser() {
			const userData = await getCurrentUser();
			if (userData) {
				setFormData((prev) => ({
					...prev,
					owner: userData.name,
					userId: userData.id,
				}));
			}
		}
		loadUser();
	}, []);

	const handleSubmit = async (e: FormEvent) => {
		try {
			e.preventDefault();
			setIsLoading(true);
			setError("");

			if (!formData.userId) {
				setError("Usuário não autenticado. Por favor, faça login novamente.");
				return;
			}

			const result = await createApp(formData);
			if (result.app) {
				setFormData({
					name: "",
					title: "",
					description: "",
					owner: "",
					userId: "",
				});
				setIsModalOpen(false);
			} else if (result.error) {
				setError(result.error);
			}
		} catch (error) {
			console.error("Erro ao criar app:", error);
			setError("Erro ao criar o app. Por favor, tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className={s.form} onSubmit={handleSubmit}>
			<div className={s["form-grid"]}>
				<div className={s["form-group"]}>
					<Input
						id="title"
						label="Organização"
						value={formData.title}
						onChange={(value) => setFormData({ ...formData, title: value })}
						placeholder="Digite o nome da organização do app"
						required
					/>
				</div>
				<div className={s["form-group"]}>
					<Input
						id="name"
						label="Nome do App"
						value={formData.name}
						onChange={(value) => setFormData({ ...formData, name: value })}
						placeholder="Digite o nome do app"
						required
					/>
				</div>
				<div className={s["form-group"]}>
					<Textarea
						id="description"
						label="Descrição"
						value={formData.description}
						onChange={(value) =>
							setFormData({ ...formData, description: value })
						}
					/>
				</div>
			</div>

			{error && <div className={s.error}>{error}</div>}

			<div className={s["modal-footer"]}>
				<Button
					type="button"
					variant="disabled"
					width="contain"
					onClick={() => setIsModalOpen(false)}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					variant="insurance"
					width="contain"
					disabled={isLoading || !formData.userId}
				>
					{isLoading ? "Criando..." : "Criar Aplicativo"}
				</Button>
			</div>
		</form>
	);
};
