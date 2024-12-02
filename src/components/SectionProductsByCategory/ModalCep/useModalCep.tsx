'use client';

import { useState } from 'react';

import { cepMask } from '@/utils';

export const PORTO_BANK_CEP_MOCK = '01216-012';

export const useModalCep = () => {
	const [inputValue, setInputValue] = useState('');
	const [status, setStatus] = useState<
		'loading' | 'not-found' | 'valid' | null
	>(null);

	const reset = () => {
		setStatus(null);
		return setInputValue('');
	};

	const handleChange = ({ target }) => {
		const { value } = target;
		if (value?.length === 0 || !value) {
			setInputValue(value);
			return setStatus(null);
		}

		return setInputValue(cepMask(value));
	};

	const handleValidateCep = (value) => {
		if (!value || status === 'valid') return null;

		setStatus('loading');
		setTimeout(() => {
			if (value !== PORTO_BANK_CEP_MOCK) {
				return setStatus('not-found');
			}
			return setStatus('valid');
		}, 1000);
	};

	return {
		inputValue,
		setInputValue,
		handleValidateCep,
		status,
		setStatus,
		handleChange,
		reset,
	};
};
