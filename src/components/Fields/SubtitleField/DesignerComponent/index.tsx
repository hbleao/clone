import s from './styles.module.scss';

import type { FormElementInstance } from '@/components/FormElements';

export const DesignerComponent = ({
	elementInstance,
}: { elementInstance: FormElementInstance }) => {
	const { title } = elementInstance.extraAttributes as any;
	return (
		<div className={s.designerComponent}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className={s.label}>Label Field</label>
			<p className={s.text}>{title}</p>
		</div>
	);
};
