"use client";
import { useState } from "react";
import { FileOutput, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import s from "./styles.module.scss";

import { updatePage } from "@/actions";
import { Button, PageBuilderCanvas, PageBuilderSidebar } from "@/components";
import { usePageBuilder } from "@/hooks";

export const PageBuilderContent = () => {
	const params = useParams();
	const { elements } = usePageBuilder();
	const pageId = params.pageId as string;
	const [isSaving, setIsSaving] = useState(false);

	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			console.log("Elementos a serem salvos:", elements);

			// Salva os elementos diretamente
			const result = await updatePage(pageId, {
				content: JSON.stringify(elements),
			});

			if (!result.success) {
				throw new Error(result.error);
			}

			toast.success("Página salva com sucesso!");
		} catch (error) {
			console.error("Error saving page:", error);
			toast.error("Erro ao salvar página");
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
							onClick={handleSaveChanges}
							disabled={isSaving}
						>
							{isSaving && <Loader2 />}
							<Save />
							Salvar
						</Button>
						<Button
							type="button"
							variant="black"
							width="contain"
							onClick={() => alert("exportou")}
						>
							<FileOutput />
							Exportar
						</Button>
					</div>
				</div>
				<PageBuilderCanvas />
			</div>
		</div>
	);
};
