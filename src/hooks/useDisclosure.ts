import { useCallback, useState, useTransition } from 'react';

interface UseDisclosureProps {
	defaultIsOpen?: boolean;
}

interface UseDisclosureReturn {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onToggle: () => void;
	isPending: boolean;
}

/**
 * Hook para gerenciar o estado de visibilidade de um componente (aberto/fechado).
 * @param defaultIsOpen Define o estado inicial de abertura (padrão: fechado).
 * @returns Um objeto contendo o estado atual (`isOpen`), funções para abrir, fechar e alternar, e o estado de transição.
 */
export const useDisclosure = ({
	defaultIsOpen = false,
}: UseDisclosureProps = {}): UseDisclosureReturn => {
	// Estado de abertura do componente
	const [isOpen, setIsOpen] = useState(defaultIsOpen);

	// Estado de transição para atualizações assíncronas
	const [isPending, startTransition] = useTransition();

	/**
	 * Abre o componente.
	 */
	const onOpen = useCallback(() => {
		startTransition(() => setIsOpen(true));
	}, []);

	/**
	 * Fecha o componente.
	 */
	const onClose = useCallback(() => {
		startTransition(() => setIsOpen(false));
	}, []);

	/**
	 * Alterna entre os estados aberto e fechado.
	 */
	const onToggle = useCallback(() => {
		startTransition(() => setIsOpen((prev) => !prev));
	}, []);

	return {
		isOpen,
		onOpen,
		onClose,
		onToggle,
		isPending,
	};
};
