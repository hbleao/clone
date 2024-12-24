import s from "./style.module.scss";

import type { DialogProps } from "./types";

export const Dialog = ({
	handleCloseModal,
	title = "Título do dialog",
	children,
}: DialogProps) => {
	return (
		<div
			className={s["modal-overlay"]}
			onClick={handleCloseModal}
			onKeyDown={handleCloseModal}
		>
			<div className={s.modal}>
				<div className={s["modal-header"]}>
					<h2>{title}</h2>
					<button
						type="button"
						className={s["close-button"]}
						onClick={handleCloseModal}
						onKeyDown={handleCloseModal}
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
				<div className={s["modal-content"]}>{children}</div>
			</div>
		</div>
	);
};
