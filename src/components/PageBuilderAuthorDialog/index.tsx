"use client";

import { useEffect, useState } from "react";

import s from "./styles.module.scss";

import { Button, Dialog } from "@/components";
import { usePageBuilder } from "@/hooks";
import { FormElements } from "@/components/FormElements";

import type { PageBuilderAuthorDialogProps } from "./types";

export const PageBuilderAuthorDialog = ({
	onClose,
	element,
}: PageBuilderAuthorDialogProps) => {
	const { updateElement } = usePageBuilder();
	const [elementFields, setElementFields] = useState(element.extraAttributes);
	const ElementComponent = FormElements[element.type].propertiesComponent;

	const applyChanges = () => {
		updateElement(element.id, {
			...element,
			extraAttributes: elementFields,
		});
		onClose();
	};

	// Reset fields when dialog opens with new element
	useEffect(() => {
		setElementFields(element.extraAttributes);
	}, [element]);

	return (
		<Dialog
			title={`Propriedades: ${FormElements[element.type].type}`}
			handleCloseModal={onClose}
		>
			<div className={s.content}>
				<ElementComponent elementInstance={element} />
			</div>
			<div className={s.footer}>
				<Button
					type="button"
					variant="disabled"
					width="contain"
					onClick={onClose}
				>
					Cancelar
				</Button>
				<Button type="button" width="contain" onClick={applyChanges}>
					Salvar
				</Button>
			</div>
		</Dialog>
	);
};
