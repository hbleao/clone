import s from './styles.module.scss';

import { useDesigner } from '@/hooks';

import { FormElementSidebar, PropertiesFormSidebar } from '@/components';

export const DesignerSidebar = () => {
	const { selectedElement } = useDesigner();

	return (
		<aside className={s.designerSidebar}>
			{!selectedElement && <FormElementSidebar />}
			{selectedElement && <PropertiesFormSidebar />}
		</aside>
	);
};
