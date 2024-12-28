"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAppBySlug } from "@/actions/app";
import { ChevronLeft } from "lucide-react";
import {
	getPagesByAppId,
	createPage,
	updatePageFull,
	deletePageById,
} from "@/actions/page";
import "./styles.scss";
import { Header, Button, Dialog, Input, Textarea } from "@/components";

import type { App, Page, PageForm } from "./types";

const initialFormState: PageForm = {
	title: "",
	slug: "",
	type: "categorias",
	content: "",
	status: "draft",
	seo: {
		title: "",
		description: "",
		keywords: "",
		ogTitle: "",
		ogDescription: "",
		ogImage: "",
		canonical: "",
		robots: "index, follow",
	},
};

export default function AppDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [app, setApp] = useState<App | null>(null);
	const [pages, setPages] = useState<Page[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"page" | "seo">("page");
	const [formData, setFormData] = useState<PageForm>(initialFormState);
	const [editingPageId, setEditingPageId] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

	useEffect(() => {
		const loadApp = async () => {
			if (params.slug) {
				const result = await getAppBySlug(params.slug as string);
				if (result.app) {
					setApp(result.app);
					const pagesResult = await getPagesByAppId(result.app.id);
					if (pagesResult.success) {
						setPages(pagesResult.pages);
					}
				}
			}
			setLoading(false);
		};

		loadApp();
	}, [params.slug]);

	const handleChange = (field: keyof Omit<PageForm, "seo">, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Auto-generate slug from title if it's empty
		if (field === "title" && !formData.slug) {
			const slug = value
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-");
			setFormData((prev) => ({
				...prev,
				slug,
			}));
		}
	};

	const handleSeoChange = (field: keyof PageForm["seo"], value: string) => {
		setFormData((prev) => ({
			...prev,
			seo: {
				...prev.seo,
				[field]: value,
			},
		}));
	};

	const handleEditPage = (page: Page) => {
		setEditingPageId(page.id);
		setFormData({
			title: page.title,
			slug: page.slug,
			type: page.type,
			content: page.content || "",
			status: page.status,
			seo: page.seo || {
				title: "",
				description: "",
				keywords: "",
				ogTitle: "",
				ogDescription: "",
				ogImage: "",
				canonical: "",
				robots: "index, follow",
			},
		});
		setIsCreateModalOpen(true);
	};

	const handleDeletePage = async () => {
		if (!pageToDelete) return;

		try {
			const result = await deletePageById(pageToDelete.id);
			if (result.success) {
				setIsDeleteModalOpen(false);
				setPageToDelete(null);

				// Reload pages
				if (app) {
					const pagesResult = await getPagesByAppId(app.id);
					if (pagesResult.success) {
						setPages(pagesResult.pages);
					}
				}
			}
		} catch (error) {
			console.error("Error deleting page:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!app) return;

		try {
			let result;
			if (editingPageId) {
				result = await updatePageFull({
					id: editingPageId,
					title: formData.title,
					slug: formData.slug,
					type: formData.type,
					content: formData.content,
					status: formData.status,
					seo: formData.seo,
				});
			} else {
				result = await createPage({
					title: formData.title,
					slug: formData.slug,
					type: formData.type,
					content: formData.content,
					status: formData.status,
					appId: app.id,
					author: app.owner,
					seo: formData.seo,
				});
			}

			if (result.success) {
				handleCloseModal();

				// Reload pages
				const pagesResult = await getPagesByAppId(app.id);
				if (pagesResult.success) {
					setPages(pagesResult.pages);
				}
			}
		} catch (error) {
			console.error("Error saving page:", error);
		}
	};

	const handleCloseModal = () => {
		setIsCreateModalOpen(false);
		setFormData(initialFormState);
		setActiveTab("page");
		setEditingPageId(null);
	};

	const handlePageClick = (page: Page) => {
		router.push(`/apps/${params.slug}/pages/${page.id}`);
	};

	if (loading) {
		return (
			<div className="app-details-container">
				<div className="loading">Carregando...</div>
			</div>
		);
	}

	if (!app) {
		return (
			<div className="app-details-container">
				<div className="error">Aplicativo não encontrado</div>
			</div>
		);
	}

	return (
		<div className="app-details-container">
			<Header />
			<div className="header">
				<Button
					type="button"
					width="contain"
					variant="disabled"
					onClick={() => router.back()}
				>
					<ChevronLeft />
					Voltar
				</Button>

				<Button
					type="button"
					width="contain"
					onClick={() => setIsCreateModalOpen(true)}
				>
					Nova Página
				</Button>
			</div>

			{isCreateModalOpen && (
				<Dialog
					handleCloseModal={handleCloseModal}
					title={editingPageId ? "Editar Página" : "Criar Nova Página"}
				>
					<form onSubmit={handleSubmit}>
						<div
							className="tabs"
							onClick={(e) => e.stopPropagation()}
							onkeyDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className={`tab ${activeTab === "page" ? "active" : ""}`}
								onClick={() => setActiveTab("page")}
							>
								Página
							</button>
							<button
								type="button"
								className={`tab ${activeTab === "seo" ? "active" : ""}`}
								onClick={() => setActiveTab("seo")}
							>
								SEO
							</button>
						</div>

						{activeTab === "page" ? (
							<div className="tab-content">
								<Input
									label="Título"
									value={formData.title}
									onChange={(value) => handleChange("title", value)}
									required
								/>
								<Input
									label="Slug"
									value={formData.slug}
									onChange={(value) => handleChange("slug", value)}
									required
								/>
								<Input
									label="Tipo"
									value={formData.type}
									onChange={(value) => handleChange("type", value)}
									required
								/>
								<Textarea
									label="Conteúdo"
									value={formData.content}
									onChange={(value) => handleChange("content", value)}
								/>
								<div className="status-select">
									<label>Status</label>
									<select
										value={formData.status}
										onChange={(e) => handleChange("status", e.target.value)}
									>
										<option value="draft">Rascunho</option>
										<option value="live">Publicado</option>
									</select>
								</div>
							</div>
						) : (
							<div className="tab-content">
								<Input
									label="Meta Title"
									value={formData.seo.title}
									onChange={(value) => handleSeoChange("title", value)}
									placeholder="Título otimizado para SEO"
								/>
								<Textarea
									label="Meta Description"
									value={formData.seo.description}
									onChange={(value) => handleSeoChange("description", value)}
									placeholder="Descrição curta para resultados de busca"
								/>
								<Input
									label="Keywords"
									value={formData.seo.keywords}
									onChange={(value) => handleSeoChange("keywords", value)}
									placeholder="Palavras-chave separadas por vírgula"
								/>
								<Input
									label="OG Title"
									value={formData.seo.ogTitle}
									onChange={(value) => handleSeoChange("ogTitle", value)}
									placeholder="Título para compartilhamento em redes sociais"
								/>
								<Textarea
									label="OG Description"
									value={formData.seo.ogDescription}
									onChange={(value) => handleSeoChange("ogDescription", value)}
									placeholder="Descrição para compartilhamento em redes sociais"
								/>
								<Input
									label="OG Image URL"
									value={formData.seo.ogImage}
									onChange={(value) => handleSeoChange("ogImage", value)}
									placeholder="URL da imagem para compartilhamento"
								/>
								<Input
									label="Canonical URL"
									value={formData.seo.canonical}
									onChange={(value) => handleSeoChange("canonical", value)}
									placeholder="URL canônica da página"
								/>
								<Input
									label="Meta Robots"
									value={formData.seo.robots}
									onChange={(value) => handleSeoChange("robots", value)}
									placeholder="Ex: index, follow"
								/>
							</div>
						)}

						<div className="form-actions">
							<Button
								type="button"
								variant="disabled"
								onClick={handleCloseModal}
							>
								Cancelar
							</Button>
							<Button type="submit">
								{editingPageId ? "Salvar" : "Criar Página"}
							</Button>
						</div>
					</form>
				</Dialog>
			)}

			{isDeleteModalOpen && pageToDelete && (
				<Dialog
					handleCloseModal={() => {
						setIsDeleteModalOpen(false);
						setPageToDelete(null);
					}}
					title="Excluir Página"
				>
					<div className="delete-confirmation">
						<p>
							Tem certeza que deseja excluir a página "{pageToDelete.title}"?
							Esta ação não pode ser desfeita.
						</p>
						<div className="form-actions">
							<Button
								type="button"
								variant="disabled"
								onClick={() => {
									setIsDeleteModalOpen(false);
									setPageToDelete(null);
								}}
							>
								Cancelar
							</Button>
							<Button type="button" variant="danger" onClick={handleDeletePage}>
								Excluir
							</Button>
						</div>
					</div>
				</Dialog>
			)}

			<div className="pages-list">
				<div className="pages-header">
					<div className="status">Status</div>
					<div className="name">Nome</div>
					<div className="type">Tipo</div>
					<div className="last-update">Última atualização</div>
					<div className="author">Autor</div>
					<div className="actions">Ações</div>
				</div>

				{pages.map((page) => (
					<div
						key={page.id}
						className="page-item"
						onClick={() => handlePageClick(page)}
					>
						<div className="status">
							<span className={`status-tag ${page.status}`}>
								{page.status === "draft" ? "Rascunho" : "Publicado"}
							</span>
						</div>
						<div className="name">{page.title}</div>
						<div className="type">{page.type}</div>
						<div className="last-update">
							{new Date(page.updatedAt).toLocaleDateString("pt-BR")}
						</div>
						<div className="author">{page.author}</div>
						<div className="actions">
							<button
								type="button"
								className="action-button edit"
								onClick={(e) => {
									e.stopPropagation();
									handleEditPage(page);
								}}
								title="Editar página"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
									<path d="m15 5 4 4" />
								</svg>
							</button>
							<button
								type="button"
								className="action-button delete"
								onClick={() => {
									setPageToDelete(page);
									setIsDeleteModalOpen(true);
								}}
								title="Excluir página"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M3 6h18" />
									<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
									<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									<line x1="10" y1="11" x2="10" y2="17" />
									<line x1="14" y1="11" x2="14" y2="17" />
								</svg>
							</button>
						</div>
					</div>
				))}

				{pages.length === 0 && (
					<div className="empty-state">
						<p>Nenhuma página encontrada. Crie sua primeira página!</p>
					</div>
				)}
			</div>
		</div>
	);
}
