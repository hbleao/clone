import React from "react";

import s from "./styles.module.scss";

import { Dialog } from "../Dialog";
import { Button } from "../Button";

type DeleteModalProps = {
	title: string;
	itemName: string;
	handleClose: () => void;
	handleDelete: (event: any) => void;
};

export const DeleteModal = ({
	title,
	itemName,
	handleClose,
	handleDelete,
}: DeleteModalProps) => {
	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleDelete(e);
	};

	return (
		<Dialog handleCloseModal={handleClose} title={title}>
			<div 
				className={s["delete-confirmation"]}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<p>
					Tem certeza que deseja excluir a página <span>"{itemName}"</span>?
					Esta ação não pode ser desfeita.
				</p>
				<div className={s.buttons}>
					<Button
						type="button"
						variant="disabled"
						size="lg"
						width="contain"
						onClick={(e) => {
							e.stopPropagation();
							handleClose();
						}}
					>
						Cancelar
					</Button>
					<Button
						type="button"
						variant="danger"
						size="lg"
						width="contain"
						onClick={handleDeleteClick}
					>
						Excluir
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
