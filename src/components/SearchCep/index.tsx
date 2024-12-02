import { cepMask, sanitize } from '@/utils';
import * as Input from '@porto-ocean/input';
import type React from 'react';
import { useState } from 'react';
import { ModalWithoutCep } from '../SectionCepWithCardPrice/ModalWithoutCep';

interface SearchCepProps {
	helperText?: string;
	onCepChange: (cep: string) => void;
	titleModal?: string;
	subTitleModal?: string;
	buttonLabel?: string;
}

export const SearchCep: React.FC<SearchCepProps> = ({
	helperText = 'Não sei o CEP',
	onCepChange,
	titleModal = 'Pesquisa de CEP',
	subTitleModal = 'Todos os campos são obrigatórios',
	buttonLabel = 'Selecionar CEP',
	...props
}) => {
	const [isOpenCepModal, setIsOpenCepModal] = useState(false);

	function handleCallBackCep(value) {
		const sanitizeValue = sanitize(value);
		onCepChange(cepMask(sanitizeValue));
	}

	return (
		<>
			<Input.HelperText
				style={{
					cursor: 'pointer',
					textDecoration: 'underline',
					color: '#0046c0',
				}}
				onClick={() => setIsOpenCepModal(true)}
				{...props}
			>
				{helperText}
			</Input.HelperText>
			{isOpenCepModal && (
				<ModalWithoutCep
					modal={{
						titleModal,
						subTitleModal,
						buttonLabel,
					}}
					handleCallBackCep={(value: string) => handleCallBackCep(value)}
					handleCloseModal={() => setIsOpenCepModal(false)}
				/>
			)}
		</>
	);
};
