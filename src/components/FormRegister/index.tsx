"use client";
import React, { type FormEvent, useState } from "react";

import s from "./styles.module.scss";

import { extraFieldsProps, schemaFields, validators } from "./validators";

import { Button, Input } from "@/components";
import { useFormValidation } from "@/hooks";
import { sanitizedForm } from "@/utils";
import { useToastStore } from "@/store";

import { signup } from "@/app/actions";

export const FormRegister = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { addToast } = useToastStore();
	const { form, errors, handleChange, validateAll, resetForm } =
		useFormValidation(schemaFields, validators);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const newRegister = sanitizedForm(form);
			if (!validateAll()) return;

			await signup(newRegister);

			resetForm();
			addToast({
				type: "info",
				message:
					"Enviamos um email de verificação para a caixa de entrada do seu email.",
			});
		} catch (error: any) {
			console.error("handleSubmit:", error.message || error);
			addToast({
				type: "error",
				message:
					"Estamos passando por um momento de instabilidade. Aguarde alguns instantes e tente novamente.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className={s.form}>
			<h2 className={s.title}>Crie sua conta</h2>
			<p className={s.subtitle}>
				Comece seu período de 30 dias grátis para conhecer a plataforma.
			</p>

			{Object.keys(form).map((field) => (
				<Input
					key={field}
					name={field}
					variant={errors[field] ? "error" : "default"}
					value={form[field]}
					onChange={handleChange}
					errorMessage={errors[field] || ""}
					radii="md"
					{...extraFieldsProps[field]}
				/>
			))}

			<Button
				type="submit"
				variant="primary"
				size="md"
				radii="md"
				loading={isLoading}
				disabled={isLoading}
			>
				Criar conta
			</Button>
		</form>
	);
};
