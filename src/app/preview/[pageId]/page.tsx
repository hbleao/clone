"use client";

import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import s from "../styles.module.scss";

export default function PreviewPage() {
	const params = useParams();
	const [pageContent, setPageContent] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPageContent = async () => {
			try {
				const response = await fetch(`/api/pages/${params.pageId}`);

				if (!response.ok) {
					throw new Error("Erro ao carregar página");
				}

				const data = await response.json();
				setPageContent(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro desconhecido");
			} finally {
				setIsLoading(false);
			}
		};

		if (params.pageId) {
			fetchPageContent();
		}
	}, [params.pageId]);

	const formattedContent =
		pageContent?.content?.sections?.map((item, index) => {
			const pageName =
				pageContent.content.sections[index].template.name.toLowerCase();
			return {
				name: pageName,
				component: { ...item.content },
			};
		}) || [];
	const jsonContent = JSON.stringify(
		{
			seo: {
				title: pageContent?.seo?.title || "",
				description: pageContent?.seo?.description || "",
				canonical: pageContent?.seo?.canonical || "",
			},
			data: formattedContent,
		},
		null,
		2,
	);

	const handleCopyContent = () => {
		navigator.clipboard
			.writeText(jsonContent)
			.then(() => {
				toast.success("Conteúdo copiado para área de transferência!");
			})
			.catch((err) => {
				toast.error("Erro ao copiar conteúdo");
				console.error("Erro ao copiar:", err);
			});
	};

	if (isLoading) {
		return (
			<div className={s.container}>
				<div className={s.loading}>Carregando...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={s.container}>
				<div className={s.error}>{error}</div>
			</div>
		);
	}

	return (
		<div className={s.container}>
			<div className={s.header}>
				<h1 className={s.title}>{pageContent.title}</h1>
				<p className={s.subtitle}>Preview do conteúdo da página</p>
			</div>

			<div className={s.contentWrapper}>
				<pre className={s.content}>{jsonContent}</pre>
				<div className={s.actionButtons}>
					<button
						type="button"
						className={s.copyButton}
						onClick={handleCopyContent}
					>
						<Copy size={16} />
						Copiar JSON
					</button>
				</div>
			</div>
		</div>
	);
}
