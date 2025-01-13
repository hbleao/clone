"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import s from "./styles.module.scss";

import { Button, Input } from "@/components";
import { authenticateUser } from "@/actions/auth";

interface LoginForm {
	registration: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<LoginForm>({
		registration: "",
		password: "",
	});
	const [error, setError] = useState<string>("");

	const handleChange = (field: keyof LoginForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await authenticateUser(formData);
			router.push("/apps");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login");
		}
	};

	return (
		<div className={s.container}>
			<div className={s.login}>
				<h1>Harbor CMS</h1>
				<p>Sistema de gerenciamento de conteúdo da porto seguro.</p>

				<form onSubmit={handleSubmit}>
					<div className={s["form-group"]}>
						<Input
							label="Matrícula"
							value={formData.registration}
							placeholder="Digite sua matrícula"
							onChange={(e) => handleChange("registration", e.target.value)}
							required
						/>
					</div>

					<div className={s["form-group"]}>
						<Input
							type="password"
							label="Senha"
							value={formData.password}
							placeholder="Digite sua senha"
							onChange={(e) => handleChange("password", e.target.value)}
							required
						/>
					</div>

					{error && <p className={s["error-message"]}>{error}</p>}

					<Button type="submit" size="lg">
						Entrar
					</Button>
				</form>
			</div>
			<div className={s.banner}>
				<Image
					src="https://www.portoseguro.com.br/content/dam/home/logo.portosegurowhite.webp"
					alt="logo da porto"
					width={340}
					height={60}
				/>
				<h1>Bem vindo de volta</h1>
				<p>Acesse sua conta agora mesmo</p>
			</div>
		</div>
	);
}
