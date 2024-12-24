'use client';
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useState,
} from 'react';

import type { FormElementInstance } from '@/components/FormElements';

type DesignerContextType = {
	elements: FormElementInstance[];
	setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
	addElement: (index: number, element: FormElementInstance) => void;
	updateElement: (id: string, element: FormElementInstance) => void;
	removeElement: (id: string) => void;

	selectedElement: FormElementInstance | null;
	setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export const DesignerContextProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [elements, setElements] = useState<FormElementInstance[]>([]);
	const [selectedElement, setSelectedElement] =
		useState<FormElementInstance | null>(null);

	const addElement = (index: number, element: FormElementInstance) => {
		setElements((oldState) => {
			const newElements = [...oldState];
			newElements.splice(index, 0, element);
			return newElements;
		});
	};

	const updateElement = (id: string, element: FormElementInstance) => {
		setElements((oldState) => {
			const newElements = [...oldState];
			const elementIndex = newElements.findIndex(
				(element) => element.id === id,
			);
			newElements[elementIndex] = element;
			return newElements;
		});
	};

	const removeElement = (id: string) => {
		setElements((oldState) => oldState.filter((element) => element.id !== id));
	};

	return (
		<DesignerContext.Provider
			value={{
				elements,
				setElements,
				selectedElement,
				setSelectedElement,
				addElement,
				updateElement,
				removeElement,
			}}
		>
			{children}
		</DesignerContext.Provider>
	);
};
