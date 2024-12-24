"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import "./styles.scss";

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
			router.push("/meus-aplicativos");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login");
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1>Marine CMS</h1>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<Input
							label="Matrícula"
							value={formData.registration}
							placeholder="Digite sua matrícula"
							onChange={(value) => handleChange("registration", value)}
							required
						/>
					</div>

					<div className="form-group">
						<Input
							type="password"
							label="Senha"
							value={formData.password}
							placeholder="Digite sua senha"
							onChange={(value) => handleChange("password", value)}
							required
						/>
					</div>

					{error && <p className="error-message">{error}</p>}

					<Button type="submit">Entrar</Button>
				</form>
			</div>
		</div>
	);
}
