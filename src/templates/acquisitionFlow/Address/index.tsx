'use client';

import { Typography } from '@porto-ocean/typography';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer } from 'react';

import './styles.scss';

import { DialogChangeCep } from './DialogChangeCep';
import { FormAddress } from './FormAddress';
import { addressFormReducer } from './reducer';
import { initialState } from './reducer/initialState';

import { useUserStore } from '@/store';

import { CardResume, SectionCustomData } from '@/components';

export function AcquisitionFlowAddress() {
	const router = useRouter();
	const user = useUserStore((state) => state.user);
	const setAddressUser = useUserStore((state) => state.setAddressUser);
	const [state, dispatch] = useReducer(addressFormReducer, initialState);
	const { fields, isEnableButton } = state;
	const productStore = useUserStore((state) => state.user.product);

	function handleNextStep(url: string) {
		router.push(url);
	}

	function initialRender() {
		dispatch({
			type: 'setAllFieldValue',
			payload: {
				...user.address,
			},
		});

		dispatch({
			type: 'setIsCepDefault',
			payload: !!user.address.street && !!user.address.neighborhood,
		});
	}

	useEffect(() => {
		initialRender();
	}, [user.address]);

	useEffect(() => {
		dispatch({ type: 'checkFieldsValidation' });

		if (isEnableButton) {
			setAddressUser({ ...user.address, ...fields });
		}
	}, [
		fields.complement,
		fields.street,
		fields.neighborhood,
		fields.number,
		fields.withoutNumber,
	]);

	return (
		<>
			<div className="acquisition-flow__address">
				<SectionCustomData
					pageName={'local-do-servico'}
					product={'servico-para-casa-e-auto'}
					vertical={'servicos'}
					subproduct={String(productStore?.categories?.category).toLowerCase()}
					category={'produto'}
					funnel={'long-form'}
				/>
				<div>
					<Typography variant="title5">Confirme o local do serviço</Typography>

					<FormAddress state={state} dispatch={dispatch} />
				</div>
				<CardResume
					isEnableButton={isEnableButton}
					handleNextStep={handleNextStep}
				/>
			</div>

			{state.isOpenDialog && (
				<DialogChangeCep state={state} dispatch={dispatch} />
			)}
		</>
	);
}
