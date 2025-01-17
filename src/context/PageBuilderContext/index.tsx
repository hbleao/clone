"use client";
import type { ElementType } from "@/components";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useState,
} from "react";

type PageBuilderElement = ElementType;

type PageBuilderContextType = {
	elements: PageBuilderElement[];
	setElements: Dispatch<SetStateAction<PageBuilderElement[]>>;
	addElement: (index: number, element: PageBuilderElement) => void;
	updateElement: (id: string, element: PageBuilderElement) => void;
	removeElement: (id: string) => void;
	selectedElement: PageBuilderElement | null;
	setSelectedElement: Dispatch<SetStateAction<PageBuilderElement | null>>;
};

export const PageBuilderContext = createContext<PageBuilderContextType | null>(
	null,
);

interface PageBuilderContextProviderProps {
	children: React.ReactNode;
	initialElements?: PageBuilderElement[];
}

export const PageBuilderContextProvider = ({
	children,
	initialElements = [],
}: PageBuilderContextProviderProps) => {
	const [elements, setElements] =
		useState<PageBuilderElement[]>(initialElements);
	const [selectedElement, setSelectedElement] =
		useState<PageBuilderElement | null>(null);
	const addElement = (index: number, element: PageBuilderElement) => {
		setElements((oldState) => {
			const newElements = [...oldState];
			newElements.splice(index, 0, element);
			return newElements;
		});
	};

	const updateElement = (id: string, element: PageBuilderElement) => {
		setElements((oldState) => {
			const newElements = [...oldState];
			const elementIndex = newElements.findIndex((el) => el.id === id);
			if (elementIndex !== -1) {
				newElements[elementIndex] = element;
			}
			return newElements;
		});
	};

	const removeElement = (id: string) => {
		setElements((oldState) => oldState.filter((element) => element.id !== id));
	};

	return (
		<PageBuilderContext.Provider
			value={{
				elements,
				setElements,
				addElement,
				updateElement,
				removeElement,
				selectedElement,
				setSelectedElement,
			}}
		>
			{children}
		</PageBuilderContext.Provider>
	);
};
