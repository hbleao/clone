"use client";

import { useMemo, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import s from "./styles.module.scss";
import type { TableProps } from "./types";
import { InputSearch } from "../InputSearch";

export function Table<T>({
	data,
	columns,
	isLoading,
	emptyMessage = "Nenhum item encontrado",
	itemsPerPage = 10,
	onRowClick,
}: TableProps<T>) {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const filteredPages = useMemo(() => {
		if (!searchTerm) return data;
		return data.filter((page: any) =>
			page.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [data, searchTerm]);

	if (isLoading) {
		return (
			<div className={s.tableWrapper}>
				<table className={s.table}>
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column.key.toString()}>{column.title}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colSpan={columns.length} className={s.loading}>
								Carregando...
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className={s.tableWrapper}>
			<div className={s.inputSearch}>
				<InputSearch
					placeholder="Buscar páginas..."
					value={searchTerm}
					onChange={(value) => setSearchTerm(value)}
				/>
			</div>
			<table className={s.table}>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column.key.toString()}>{column.title}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{currentData.length === 0 ? (
						<tr>
							<td colSpan={columns.length} className={s.empty}>
								{emptyMessage}
							</td>
						</tr>
					) : (
						filteredPages.map((item, index) => (
							<tr
								key={index}
								className={onRowClick ? s.clickable : ""}
								onClick={() => onRowClick?.(item)}
							>
								{columns.map((column) => (
									<td key={column.key.toString()}>
										{column.render
											? column.render(item)
											: item[column.key as keyof T]}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>

			<div className={s.pagination}>
				<div className={s.info}>
					{filteredPages.length > 0 && (
						<>
							Mostrando {currentPage * itemsPerPage + 1} -{" "}
							{Math.min((currentPage + 1) * itemsPerPage, filteredPages.length)}{" "}
							de {data.length} itens
						</>
					)}
				</div>
				<div className={s.controls}>
					<button
						onClick={() => goToPage(1)}
						disabled={currentPage === 1 || data.length === 0}
						title="Primeira página"
						className={s.button}
					>
						<ChevronsLeft size={16} />
					</button>

					<button
						onClick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1 || data.length === 0}
						title="Página anterior"
						className={s.button}
					>
						<ChevronLeft size={16} />
					</button>

					<div className={s.current}>
						{currentPage} / {totalPages || 1}
					</div>

					<button
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages || data.length === 0}
						title="Próxima página"
						className={s.button}
					>
						<ChevronRight size={16} />
					</button>

					<button
						onClick={() => goToPage(totalPages)}
						disabled={currentPage === totalPages || data.length === 0}
						title="Última página"
						className={s.button}
					>
						<ChevronsRight size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
