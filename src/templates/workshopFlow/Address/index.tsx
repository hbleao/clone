'use client';

import { CardResume } from '@/components/CardResume';
import { Typography } from '@porto-ocean/typography';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { addressReducer } from './reducer';
import { initialState } from './reducer/initialState';

import { AddressForm } from './AddressForm';
import './styles.scss';

export function WorkshopFlowAddress() {
	const router = useRouter();
	const [state, dispatch] = useReducer(addressReducer, initialState);

	function handleNextStep(url: string) {
		router.push(url);
	}

	return (
		<>
			<div className="workshop-flow__address">
				<div className="workshop-flow__address__left__section">
					<Typography variant="title5">Escolha a oficina</Typography>
					<AddressForm state={state} dispatch={dispatch} />
				</div>
				<CardResume
					isEnableButton={state.isEnableButton}
					handleNextStep={handleNextStep}
					variant="caps"
				/>
			</div>
		</>
	);
}
