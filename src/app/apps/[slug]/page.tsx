"use client";

import { getAppBySlug } from "@/actions/app";
import { Copy, Edit, PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import "./styles.scss";

import {
	createPage,
	deletePageById,
	duplicatePage,
	getPagesByAppId,
	updatePageFull,
} from "@/actions/page";
import { Button, DashboardLayout, Dialog, Input, Textarea } from "@/components";

import type { App, Page, PageForm } from "./types";

const initialFormState: PageForm = {
	title: "",
	slug: "",
	type: "categorias",
	content: "",
	status: "draft",
	seo: {
		id: "",
		title: "",
		description: "",
		keywords: "",
		canonical: "",
		robots: "index, follow",
		pageId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
};

export default function AppDetailsPage({ params }) {
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

	const loadAppBySlug = async () => {
		try {
			if (!params.slug) return;
			const { app } = await getAppBySlug(params.slug);
			if (!app?.id) return;
			setApp(app!);
			const pagesResult = await getPagesByAppId(app.id);
			setPages(pagesResult.pages);
		} catch (error) {
			console.error("Falha ao carregar as paginas", error);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field: keyof Omit<PageForm, "seo">, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Auto-generate slug from title if it's empty
		if (field === "title") {
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
			content: page.content ?? "",
			status: page.status,
			seo: page.seo
				? {
					id: page.seo.id,
					title: page.seo.title,
					description: page.seo.description,
					keywords: page.seo.keywords,
					canonical: page.seo.canonical,
					robots: page.seo.robots,
					pageId: page.seo.pageId,
					createdAt: new Date(page.seo.createdAt),
					updatedAt: new Date(page.seo.updatedAt),
				}
				: {
					id: "",
					title: "",
					description: "",
					keywords: "",
					canonical: "",
					robots: "index, follow",
					pageId: "",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
		});
		setIsCreateModalOpen(true);
	};

	const handleDeletePage = async (event?: React.MouseEvent) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!pageToDelete?.id) return;

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

	const handleDuplicatePage = async (page: Page) => {
		try {
			const result = await duplicatePage(page.id);
			if (result.success) {
				toast.success("Página duplicada com sucesso!");

				// Recarregar páginas
				const pagesResult = await getPagesByAppId(app.id);
				if (pagesResult.success) {
					setPages(pagesResult.pages);
				}

				// Redirecionar para página duplicada
				router.push(`/apps/${params.slug}/pages/${result.page.id}`);
			} else {
				toast.error(result.error || "Erro ao duplicar página");
			}
		} catch (error) {
			console.error("Erro ao duplicar página:", error);
			toast.error("Erro ao duplicar página");
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

	useEffect(() => {
		loadAppBySlug();
	}, [params.slug]);

	return (
		<DashboardLayout slug={params?.slug}>
			<div className="app-details-container">
				<div className="pageHeader">
					<h1>Gerencie a lista de páginas do seu aplicativo</h1>

					<Button
						type="button"
						width="contain"
						size="lg"
						onClick={() => setIsCreateModalOpen(true)}
					>
						<PlusIcon size={20} />
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
										onChange={(value) =>
											handleChange("title", value.target.value)
										}
										required
									/>
									<Input
										label="Slug"
										value={formData.slug}
										onChange={(value) =>
											handleChange("slug", value.target.value)
										}
										required
									/>
									<Input
										label="Tipo"
										value={formData.type}
										onChange={(value) =>
											handleChange("type", value.target.value)
										}
										required
									/>
									<Textarea
										label="Conteúdo"
										value={formData.content}
										placeholder="Digite uma descrição para a página"
										onChange={(value) =>
											handleChange("content", value.target.value)
										}
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
										value={formData.seo?.title || ""}
										onChange={(value) =>
											handleSeoChange("title", value.target.value)
										}
										placeholder="Título otimizado para SEO"
									/>
									<Textarea
										label="Meta Description"
										value={formData.seo.description}
										onChange={(value) =>
											handleSeoChange("description", value.target.value)
										}
										placeholder="Descrição curta para resultados de busca"
									/>
									<Input
										label="Keywords"
										value={formData.seo.keywords}
										onChange={(value) =>
											handleSeoChange("keywords", value.target.value)
										}
										placeholder="Palavras-chave separadas por vírgula"
									/>
									<Input
										label="Canonical URL"
										value={formData.seo.canonical}
										onChange={(value) =>
											handleSeoChange("canonical", value.target.value)
										}
										placeholder="URL canônica da página"
									/>
									<Input
										label="Meta Robots"
										value={formData.seo.robots}
										onChange={(value) =>
											handleSeoChange("robots", value.target.value)
										}
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
									size="lg"
									width="contain"
									onClick={() => {
										setIsDeleteModalOpen(false);
										setPageToDelete(null);
									}}
								>
									Cancelar
								</Button>
								<Button
									type="button"
									variant="danger"
									size="lg"
									width="contain"
									onClick={(event) => {
										event.stopPropagation();
										handleDeletePage(event);
									}}
								>
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
									<Edit />
								</button>
								<button
									type="button"
									className="action-button duplicate"
									onClick={(e) => {
										e.stopPropagation();
										handleDuplicatePage(page);
									}}
									title="Duplicar página"
								>
									<Copy size={16} />
								</button>
								<button
									type="button"
									className="action-button delete"
									onClick={(e) => {
										e.stopPropagation();
										setPageToDelete(page);
										setIsDeleteModalOpen(true);
									}}
									title="Excluir página"
								>
									<Trash />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
