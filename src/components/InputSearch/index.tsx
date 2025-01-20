import { Search } from "lucide-react";

import styles from "./styles.module.scss";

import type { InputSearchProps } from "./types";

export function InputSearch({
	placeholder,
	value,
	onChange,
}: InputSearchProps) {
	return (
		<div className={styles.container}>
			<div className={styles.iconContainer}>
				<Search size={16} />
			</div>
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={styles.input}
			/>
		</div>
	);
}
