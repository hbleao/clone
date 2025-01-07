"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import s from "./styles.module.scss";
import type { TableProps } from "./types";

export function Table<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "Nenhum item encontrado",
  itemsPerPage = 10,
  onRowClick,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
            currentData.map((item, index) => (
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

      {data.length > 0 && (
        <div className={s.pagination}>
          <div className={s.info}>
            Mostrando {startIndex + 1} até{" "}
            {Math.min(endIndex, data.length)} de {data.length} itens
          </div>

          <div className={s.controls}>
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              title="Primeira página"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className={s.current}>{currentPage}</span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Próxima página"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
