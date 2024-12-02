'use client';

import { useState } from 'react';

export const useModal = () => {
	const [modalIndex, setModalIndex] = useState<number | null>(null);

	const openModal = (index: number) => setModalIndex(index);
	const closeModal = () => setModalIndex(null);

	return {
		openModal,
		closeModal,
		modalIndex,
	};
};
