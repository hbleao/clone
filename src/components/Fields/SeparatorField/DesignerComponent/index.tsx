import s from './styles.module.scss';

import type { FormElementInstance } from '@/components/FormElements';

export const DesignerComponent = ({
	elementInstance,
}: { elementInstance: FormElementInstance }) => {
	return (
		<div className={s.designerComponent}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className={s.label}>Separator Field</label>
			<div className={s.line} />
		</div>
	);
};
