'use client';

import { useEffect, useState } from 'react';

import { getProps } from './getProps';

import * as Dialog from '@/components/Dialog';

export const openDialogError = ({ errorCode }) => {
	const customEvent = new CustomEvent('openDialog', { detail: { errorCode } });
	return window.dispatchEvent(customEvent);
};

const lockScroll = () => {
	return document.body.classList.add('no-scroll');
};

const unlockScroll = () => {
	return document.body.classList.remove('no-scroll');
};

export const DialogError = () => {
	const [errorCode, setErrorCode] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const isInTheDocument = (query) => {
		if (isOpen) return;

		return !!document.querySelector(query);
	};

	const handleButtonClick = () => {
		unlockScroll();
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleOpenDialog = (e: CustomEvent<{ errorCode: string }>) => {
			lockScroll();
			setErrorCode(e.detail.errorCode);

			return setIsOpen(
				// biome-ignore lint/complexity/noUselessTernary: <explanation>
				isInTheDocument(`dialog-${e.detail.errorCode}`) ? false : true,
			);
		};

		window.addEventListener('openDialog', handleOpenDialog);

		return () => {
			window.removeEventListener('openDialog', handleOpenDialog);
		};
	}, []);

	if (!isOpen) {
		return null;
	}

	const { title, subtitle, description, icon, buttonLabel } = getProps({
		errorCode,
	});

	return (
		<Dialog.Root isOpen={true} id={`dialog-${errorCode}`}>
			<Dialog.Header>
				<Dialog.Icon size="text-3xl" iconName={icon} />
			</Dialog.Header>
			<Dialog.Typography as="h3" className="dialog__title" color="black85">
				{title}
			</Dialog.Typography>
			<Dialog.Body>
				{subtitle && (
					<Dialog.Typography
						variant="body1"
						weight="bold"
						as="p"
						color="black85"
						className="dialog__subtitle"
					>
						{subtitle}
					</Dialog.Typography>
				)}
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					className="dialog__description"
					color="black75"
				>
					{description}
				</Dialog.Typography>
			</Dialog.Body>
			<Dialog.Footer variant="row">
				<Dialog.Button width="fluid" onClick={handleButtonClick}>
					{buttonLabel}
				</Dialog.Button>
			</Dialog.Footer>
		</Dialog.Root>
	);
};
