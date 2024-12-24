import s from "./styles.module.scss";

import { FormElements } from "../FormElements";
import { SidebarBtnElement } from "../SidebarBtnElement";

export const FormElementSidebar = () => {
	return (
		<div className={s.designerSidebarForm}>
			<p className={s.title}>Layout Elements</p>
			<div className={s.designerSidebarFormContent}>
				<SidebarBtnElement formElement={FormElements.TitleField} />
				<SidebarBtnElement formElement={FormElements.SubTitleField} />
				<SidebarBtnElement formElement={FormElements.ParagraphField} />
				<SidebarBtnElement formElement={FormElements.SeparatorField} />
				<SidebarBtnElement formElement={FormElements.SpacerField} />
			</div>
			<p className={s.title}>Form Elements</p>
			<div className={s.designerSidebarFormContent}>
				<SidebarBtnElement formElement={FormElements.TextField} />
			</div>
		</div>
	);
};
