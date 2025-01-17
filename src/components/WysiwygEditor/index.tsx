"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface WysiwygEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export const WysiwygEditor = ({ value, onChange }: WysiwygEditorProps) => {
	const ReactQuill = useMemo(
		() => dynamic(() => import("react-quill"), { ssr: false }),
		[],
	);

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ color: [] }, { background: [] }],
			["link", "image"],
			["clean"],
		],
	};

	return (
		<ReactQuill
			theme="snow"
			value={value}
			onChange={onChange}
			modules={modules}
			className="wysiwyg-editor"
		/>
	);
};
