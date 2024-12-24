import s from './styles.module.scss';

import { Input } from '@/components';
import type { FormElementInstance } from '@/components/FormElements';

export const DesignerComponent = ({
	elementInstance,
}: { elementInstance: FormElementInstance }) => {
	const { label, required, placeholder, helperText } =
		elementInstance.extraAttributes as any;
	return (
		<div className={s.designerComponent}>
			<Input
				label={required ? `${label}*` : label}
				placeholder={placeholder}
				disabled
				readOnly
			/>
			{helperText && <p className={s.helperText}>{helperText}</p>}
		</div>
	);
};
