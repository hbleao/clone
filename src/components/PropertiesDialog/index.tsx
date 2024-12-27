"use client";

import { useEffect, useState } from "react";

import s from "./styles.module.scss";

import { Dialog } from "@/components";
import { useDesigner } from "@/hooks";
import {
	FormElements,
	type FormElementInstance,
} from "@/components/FormElements";

interface PropertiesDialogProps {
	onClose: () => void;
	element: FormElementInstance;
}

export const PropertiesDialog = ({
	onClose,
	element,
}: PropertiesDialogProps) => {
	const { updateElement } = useDesigner();
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
				<ElementComponent 
					elementInstance={element}
					updateElement={(newElement: FormElementInstance) => {
						updateElement(element.id, newElement);
					}}
				/>
			</div>
			<div className={s.footer}>
				<button onClick={onClose} className={s.cancelButton}>
					Cancelar
				</button>
				<button onClick={applyChanges} className={s.saveButton}>
					Salvar
				</button>
			</div>
		</Dialog>
	);
};
