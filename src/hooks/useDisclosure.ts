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

export const useDisclosure = ({
	defaultIsOpen = false,
}: UseDisclosureProps = {}): UseDisclosureReturn => {
	const [isOpen, setIsOpen] = useState(defaultIsOpen);
	const [isPending, startTransition] = useTransition();

	const onOpen = useCallback(() => {
		startTransition(() => {
			setIsOpen(true);
		});
	}, []);

	const onClose = useCallback(() => {
		startTransition(() => {
			setIsOpen(false);
		});
	}, []);

	const onToggle = useCallback(() => {
		startTransition(() => {
			setIsOpen((prev) => !prev);
		});
	}, []);

	return {
		isOpen,
		onOpen,
		onClose,
		onToggle,
		isPending,
	};
};
