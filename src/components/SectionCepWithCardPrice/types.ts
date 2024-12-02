import type { Color } from '../CardPrice/types';

export type SectionCepWithCardPriceProps = {
	sectionTitle?: string;
	buttonLabel?: string;
	cardOldPrice?: string;
	cardPrice?: string;
	discount?: string;
	promoLabel?: string;
	installments?: string;
	benefitsText?: string;
	promoLabelColor?: Color;
	promoLabelBgColor?: Color;
	modal: ModalProps;
};

export type VariantState = 'insurance' | 'disabled';

export type ModalProps = {
	titleModal: string;
	subTitleModal: string;
	buttonLabel: string;
};
