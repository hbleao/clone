'use client';

import { CardResume as CardResumeCaps } from '@/components/CardResume/Variants/CardResumeCaps';
import { CardResume as CardResumeDefault } from '@/components/CardResume/Variants/CardResumeDefault';
import type { TCardResume } from './types';

import './styles.scss';

export const CardResume = ({ variant = 'default', ...props }: TCardResume) => {
	switch (variant) {
		case 'default':
			return <CardResumeDefault {...props} />;

		case 'caps':
			return <CardResumeCaps {...props} />;
	}
};
