"use client";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { updatePage } from "@/actions";
import { Button, PageBuilderCanvas, PageBuilderSidebar } from "@/components";
import { ElementWrapper } from "@/components/PageBuilderElement/ElementWrapper";
import { usePageBuilder } from "@/hooks";
import { carbonOnSaveDatabaseService } from "@/services";
import { formatJSONContent } from "@/utils";

export const PageBuilderContent = ({ page }) => {
	const params = useParams();
	const router = useRouter();
	const { elements, setElements } = usePageBuilder();
	const pageId = params.pageId as string;
	const pageSlug = params.slug as string;
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		try {
			setIsSaving(true);

			// Mantém todos os elementos no JSON, incluindo a flag isEnabled
			const formattedContent = {
				sections: elements.map((element) => ({
					...element,
					isEnabled: element.isEnabled ?? true, // Se não existir, considera como true
				})),
			};

			const jsonContent = formatJSONContent(formattedContent);
			await carbonOnSaveDatabaseService(jsonContent, pageSlug);

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

	const handleElementUpdate = (elementId: string, updates: any) => {
		const newElements = elements.map((element) =>
			element.id === elementId ? { ...element, ...updates } : element,
		);
		setElements(newElements);
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
							size="lg"
							onClick={() => router.push(`/preview/${page.id}`)}
						>
							<ExternalLink />
							Preview
						</Button>
						<Button
							type="button"
							width="contain"
							size="lg"
							onClick={handleSave}
							disabled={isSaving}
						>
							{isSaving && <Loader2 />}
							<Save />
							Salvar
						</Button>
					</div>
				</div>
				<div className={s.content}>
					{elements.map((element) => (
						<ElementWrapper
							key={element.id}
							element={element}
							onEdit={(updates) => handleElementUpdate(element.id, updates)}
							onRemove={() => {
								const newElements = elements.filter((e) => e.id !== element.id);
								setElements(newElements);
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
