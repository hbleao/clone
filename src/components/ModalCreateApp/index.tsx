import s from "./style.module.scss";

import type { ModalCreateAppProps } from "./types";

export const ModalCreateApp = ({
	setIsModalOpen,
	formData,
	setFormData,
	handleSubmit,
	isLoading,
}: ModalCreateAppProps) => {
	return (
		<div
			className="modal-overlay"
			onClick={() => setIsModalOpen(false)}
			onKeyDown={() => setIsModalOpen(false)}
		>
			<div
				className="modal"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="modal-header">
					<h2>Criar Novo Aplicativo</h2>
					<button
						type="button"
						className="close-button"
						onClick={() => setIsModalOpen(false)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<title>Fechar</title>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="name">Nome do App</label>
							<input
								id="name"
								type="text"
								placeholder="Digite o nome do app"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="owner">Proprietário</label>
							<input
								id="owner"
								type="text"
								placeholder="Digite o nome do proprietário"
								value={formData.owner}
								onChange={(e) =>
									setFormData({ ...formData, owner: e.target.value })
								}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="description">Descrição</label>
							<textarea
								id="description"
								placeholder="Digite uma descrição para o app"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="cancel-button"
							onClick={() => setIsModalOpen(false)}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="submit-button"
							disabled={isLoading}
						>
							{isLoading ? "Criando..." : "Criar Aplicativo"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
