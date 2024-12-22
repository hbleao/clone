"use client";

import { useState, type FormEvent } from "react";

import "./styles.scss";

interface LoginForm {
	registration: string;
	password: string;
}

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginForm>({
		registration: "",
		password: "",
	});
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Aqui você implementará a lógica de autenticação
			console.log("Dados do formulário:", formData);

			// Exemplo de validação básica
			if (!formData.registration || !formData.password) {
				throw new Error("Por favor, preencha todos os campos");
			}

			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error);
			}

			// Redireciona para a página de aplicativos após login bem-sucedido
			window.location.href = "/meus-aplicativos";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1>KrillCore</h1>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="registration">Matrícula</label>
						<input
							type="text"
							id="registration"
							name="registration"
							value={formData.registration}
							onChange={handleChange}
							placeholder="Digite sua matrícula"
							autoComplete="off"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Senha</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Digite sua senha"
							required
						/>
					</div>

					{error && <div className="error-message">{error}</div>}

					<button type="submit" className="login-button" disabled={isLoading}>
						{isLoading ? "Entrando..." : "Entrar"}
					</button>
				</form>
			</div>
		</div>
	);
}
