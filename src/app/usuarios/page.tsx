"use client";

import { useEffect, useState } from "react";
import { Button, Header, Dialog, Input } from "@/components";
import { Plus } from "lucide-react";

import {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
} from "@/actions/user";

import "./styles.scss";

interface User {
	id: string;
	name: string;
	email: string;
	registration: string;
	role: string;
	createdAt: Date;
}

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState<UserFormData>({
		name: "",
		email: "",
		registration: "",
		role: "AUTHOR",
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		setIsLoading(true);
		try {
			const response = await getAllUsers();
			setUsers(response);
		} catch (error) {
			console.error("Erro ao carregar usuários:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setIsLoading(true);

		try {
			const response = await createUser(formData);
			setUsers((prev) => [...prev, response]);
			setIsCreateModalOpen(false);
			setFormData({
				name: "",
				email: "",
				registration: "",
				role: "AUTHOR",
				password: "",
				confirmPassword: "",
			});
		} catch (error) {
			if (error instanceof Error) {
				setErrors({ root: error.message });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser) return;
		setErrors({});
		setIsLoading(true);

		try {
			const editData = {
				name: formData.name,
				email: formData.email,
				registration: formData.registration,
				role: formData.role,
				...(formData.password
					? {
							password: formData.password,
							confirmPassword: formData.confirmPassword,
						}
					: {}),
			};

			const response = await updateUser(selectedUser.id, editData);
			setUsers((prev) =>
				prev.map((user) => (user.id === selectedUser.id ? response : user)),
			);

			setIsEditModalOpen(false);
			setSelectedUser(null);
			setFormData({
				name: "",
				email: "",
				registration: "",
				role: "AUTHOR",
				password: "",
				confirmPassword: "",
			});
		} catch (error) {
			if (error instanceof Error) {
				setErrors({ root: error.message });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteUser = async () => {
		if (!selectedUser) return;

		setIsLoading(true);

		try {
			await deleteUser(selectedUser.id);

			setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
			setIsDeleteModalOpen(false);
			setSelectedUser(null);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleEditClick = (user: User) => {
		setSelectedUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			registration: user.registration,
			role: user.role,
			password: "",
			confirmPassword: "",
		});
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (user: User) => {
		setSelectedUser(user);
		setIsDeleteModalOpen(true);
	};

	return (
		<div className="users-container">
			<Header />
			<div className="content">
				<div className="header">
					<h1>Usuários</h1>
					<Button
						type="button"
						width="contain"
						onClick={() => setIsCreateModalOpen(true)}
					>
						<Plus />
						Novo usuário
					</Button>
				</div>

				<div className="users-list">
					<div className="users-header">
						<div className="name">Nome</div>
						<div className="email">Email</div>
						<div className="registration">Matrícula</div>
						<div className="role">Função</div>
						<div className="last-access">Criado em</div>
						<div className="actions">Ações</div>
					</div>

					{users.map((user) => (
						<div key={user.id} className="user-item">
							<div className="name">{user.name}</div>
							<div className="email">{user.email}</div>
							<div className="registration">{user.registration}</div>
							<div className="role">
								<span className={`role-tag ${user.role.toLowerCase()}`}>
									{user.role}
								</span>
							</div>
							<div className="last-access">
								{new Date(user.createdAt).toLocaleDateString("pt-BR")}
							</div>
							<div className="actions">
								<button
									type="button"
									className="action-button edit"
									title="Editar usuário"
									onClick={() => handleEditClick(user)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Editar usuário</title>
										<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
									</svg>
								</button>
								<button
									type="button"
									className="action-button delete"
									title="Excluir usuário"
									onClick={() => handleDeleteClick(user)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Excluir usuário</title>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal de Criação */}
			{isCreateModalOpen && (
				<Dialog
					title="Criar Novo Usuário"
					handleCloseModal={() => {
						setIsCreateModalOpen(false);
						setErrors({});
					}}
				>
					<form onSubmit={handleCreateUser}>
						<Input
							label="Nome"
							name="name"
							value={formData.name}
							onChange={(value) => handleInputChange("name", value)}
							required
						/>
						<Input
							label="Email"
							type="email"
							name="email"
							value={formData.email}
							onChange={(value) => handleInputChange("email", value)}
							required
						/>
						<Input
							label="Matrícula"
							name="registration"
							value={formData.registration}
							onChange={(value) => handleInputChange("registration", value)}
							required
						/>
						<div className="select-wrapper">
							<label htmlFor="role">Função</label>
							<select
								name="role"
								value={formData.role}
								onChange={(e) => handleInputChange("role", e.target.value)}
								className={errors.role ? "error" : ""}
								required
							>
								<option value="AUTHOR">Autor</option>
								<option value="EDITOR">Editor</option>
								<option value="ADMIN">Admin</option>
							</select>
							{errors.role && (
								<span className="error-message">{errors.role}</span>
							)}
						</div>
						<Input
							label="Senha"
							type="password"
							name="password"
							value={formData.password}
							onChange={(value) => handleInputChange("password", value)}
							required
						/>
						<Input
							label="Confirmar Senha"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={(value) => handleInputChange("confirmPassword", value)}
							required
						/>
						{errors.root && <div className="error-message">{errors.root}</div>}
						<div className="form-actions">
							<Button
								type="button"
								variant="disabled"
								onClick={() => {
									setIsCreateModalOpen(false);
									setErrors({});
								}}
							>
								Cancelar
							</Button>
							<Button type="submit">
								{isLoading ? "Criando..." : "Criar"}
							</Button>
						</div>
					</form>
				</Dialog>
			)}

			{/* Modal de Edição */}
			{isEditModalOpen && selectedUser && (
				<Dialog
					title="Editar Usuário"
					handleCloseModal={() => {
						setIsEditModalOpen(false);
						setSelectedUser(null);
						setErrors({});
					}}
				>
					<form onSubmit={handleEditUser}>
						<Input
							label="Nome"
							name="name"
							value={formData.name}
							onChange={(value) => handleInputChange("name", value)}
							required
						/>
						<Input
							label="Email"
							type="email"
							name="email"
							value={formData.email}
							onChange={(value) => handleInputChange("email", value)}
							required
						/>
						<Input
							label="Matrícula"
							name="registration"
							value={formData.registration}
							onChange={(value) => handleInputChange("registration", value)}
							required
						/>
						<div className="select-wrapper">
							<label htmlFor="role">Função</label>
							<select
								name="role"
								value={formData.role}
								onChange={(e) => handleInputChange("role", e.target.value)}
								className={errors.role ? "error" : ""}
								required
							>
								<option value="AUTHOR">Autor</option>
								<option value="EDITOR">Editor</option>
								<option value="ADMIN">Admin</option>
							</select>
							{errors.role && (
								<span className="error-message">{errors.role}</span>
							)}
						</div>
						<Input
							label="Nova Senha"
							type="password"
							name="password"
							value={formData.password}
							onChange={(value) => handleInputChange("password", value)}
						/>
						<Input
							label="Confirmar Nova Senha"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={(value) => handleInputChange("confirmPassword", value)}
						/>
						{errors.root && <div className="error-message">{errors.root}</div>}
						<div className="form-actions">
							<Button
								type="button"
								variant="disabled"
								onClick={() => {
									setIsEditModalOpen(false);
									setSelectedUser(null);
									setErrors({});
								}}
							>
								Cancelar
							</Button>
							<Button type="submit">
								{isLoading ? "Salvando..." : "Salvar alterações"}
							</Button>
						</div>
					</form>
				</Dialog>
			)}

			{/* Modal de Exclusão */}
			{isDeleteModalOpen && selectedUser && (
				<Dialog
					title="Excluir Usuário"
					handleCloseModal={() => {
						setIsDeleteModalOpen(false);
						setSelectedUser(null);
					}}
				>
					<div className="delete-confirmation">
						<p>
							Tem certeza que deseja excluir o usuário{" "}
							<strong>{selectedUser.name}</strong>?
						</p>
						<p className="warning">Esta ação não poderá ser desfeita.</p>
						<div className="form-actions">
							<Button
								type="button"
								variant="disabled"
								onClick={() => {
									setIsDeleteModalOpen(false);
									setSelectedUser(null);
								}}
							>
								Cancelar
							</Button>
							<Button type="button" variant="danger" onClick={handleDeleteUser}>
								{isLoading ? "Excluindo..." : "Excluir"}
							</Button>
						</div>
					</div>
				</Dialog>
			)}
		</div>
	);
}
