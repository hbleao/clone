import { joinClasses } from '@porto-ocean/utils';

import './styles.scss';

import type { InputProps } from './types';

export const Input = ({ className = '', ...props }: InputProps) => {
	return (
		<div
			className={joinClasses(['checkbox__input', String(className)])}
			{...props}
		>
			<svg
				width="21"
				height="20"
				viewBox="0 0 21 20"
				fill="none"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				className="checkbox__svg"
			>
				<title>dsd</title>
				<path
					d="M15.5 6.66676L9.61714 13.3334L5.5 9.16604"
					stroke="white"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};
