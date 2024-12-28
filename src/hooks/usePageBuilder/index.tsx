"use client";
import { PageBuilderContext } from "@/context";
import { useContext } from "react";

export const usePageBuilder = () => {
	const context = useContext(PageBuilderContext);

	if (!context)
		throw new Error("usePageBuilder must be used within a PageBuilderContext");

	return context;
};
