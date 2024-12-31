"use client";
import { useState } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import s from "./styles.module.scss";

import { updatePage } from "@/actions";
import { Button, PageBuilderCanvas, PageBuilderSidebar } from "@/components";
import { usePageBuilder } from "@/hooks";

export const PageBuilderContent = ({ page }) => {
	const params = useParams();
	const router = useRouter();
	const { elements } = usePageBuilder();
	const pageId = params.pageId as string;
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		try {
			setIsSaving(true);

			// Converte os elementos para o formato esperado pela API
			const formattedContent = {
				sections: elements.map((element) => ({
					...element,
					content: element.content || {},
				})),
			};

			// Salva os elementos formatados
			const result = await updatePage(pageId, {
				content: formattedContent,
			});

			if (!result.success) {
				throw new Error(result.error || "Erro ao salvar a página");
			}

			toast.success("Página salva com sucesso!");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao salvar a página",
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={s.pageBuilder}>
			<PageBuilderSidebar />
			<div className={s.containerContent}>
				<div className={s.header}>
					<h1 className={s.title}>Construtor de páginas</h1>
					<div className={s.buttons}>
						<Button
							type="button"
							width="contain"
							onClick={() => router.push(`/preview/${page.id}`)}
						>
							<ExternalLink />
							Preview
						</Button>
						<Button
							type="button"
							width="contain"
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving && <Loader2 />}
							<Save />
							Salvar
						</Button>
					</div>
				</div>
				<PageBuilderCanvas />
			</div>
		</div>
	);
};
