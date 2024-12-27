"use client";
import s from "./styles.module.scss";
import { Button, SectionTemplateList } from "@/components";
import { useParams } from "next/navigation";
import { useDesigner } from "@/hooks";
import { nanoid } from "nanoid";
import { updatePage } from "@/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormElementInstance, ElementsType } from "@/components/FormElements";
import { FormElements } from "@/components/FormElements";

export function FormElementSidebar() {
	const params = useParams();
	const slug = params.slug as string;
	const pageId = params.pageId as string;
	const { elements, addElement } = useDesigner();
	const [isSaving, setIsSaving] = useState(false);

	const handleAddSection = (template: any) => {
		if (!template) {
			toast.error("Template inválido");
			return;
		}

		console.log('Template received:', template);
		const schema = typeof template.schema === "string" ? JSON.parse(template.schema) : template.schema;
		console.log('Schema:', schema);
		console.log('Fields:', schema.fields);

		const id = nanoid();
		const type: ElementsType = "SectionField";
		const element = FormElements[type].construct(id);
		
		// Inicializa os campos do template com valores vazios
		const initialContent = schema.fields.reduce((acc: Record<string, any>, field: any) => {
			if (field.type === 'array') {
				// Se for array, inicializa como array vazio
				acc[field.name] = [];
			} else {
				// Para outros tipos, inicializa como string vazia
				acc[field.name] = "";
			}
			return acc;
		}, {});

		element.extraAttributes = {
			template: {
				...template,
				schema: schema,
			},
			content: JSON.stringify(initialContent),
		};

		console.log('Adding section element:', {
			id: element.id,
			type: element.type,
			extraAttributes: element.extraAttributes,
		});

		addElement(elements.length, element);
	};

	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			// Converte os elementos para o formato de conteúdo
			const content = elements.map((element) => ({
				id: element.id,
				templateId: element.extraAttributes?.template.id,
				content: element.extraAttributes?.content || "",
				order: elements.indexOf(element),
			}));

			// Salva o conteúdo na página
			const result = await updatePage(pageId, {
				content: JSON.stringify(content),
			});

			if (result.success) {
				toast.success("Alterações salvas com sucesso!");
			} else {
				toast.error("Erro ao salvar alterações");
			}
		} catch (error) {
			console.error("Erro ao salvar alterações:", error);
			toast.error("Erro ao salvar alterações");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={s.designerSidebarForm}>
			<div className={s.designerSidebarFormHeader}>
				<Button 
					type="button" 
					width="contain" 
					onClick={handleSaveChanges}
					disabled={isSaving}
				>
					{isSaving ? (
						<>
							<Loader2 className={s.loadingIcon} />
							Salvando...
						</>
					) : (
						"Salvar Alterações"
					)}
				</Button>
			</div>
			<p className={s.title}>Templates de Seção</p>
			<div className={s.designerSidebarFormContent}>
				<SectionTemplateList 
					slug={slug} 
					onSelectTemplate={handleAddSection} 
				/>
			</div>
		</div>
	);
}
