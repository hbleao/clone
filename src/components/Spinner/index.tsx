import s from './styles.module.scss';

import type { SpinnerProps } from './types';

export const Spinner = ({ size }: SpinnerProps) => {
	return <div className={`${s.spinner} ${s[size]}`} />;
};
