export type TDialogError = {
	isOpen: boolean;
	onOpen?: () => unknown;
	onClose?: () => unknown;
};
