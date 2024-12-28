export type ElementsType = "SectionField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
	type: ElementsType;
	construct: (id: string) => FormElementInstance;
	designerBtnElement: {
		icon: any;
		label: string;
	};
	designerComponent: React.FC<{ elementInstance: FormElementInstance }>;
	formComponent: React.FC<{
		elementInstance: FormElementInstance;
		submitValue?: SubmitFunction;
		defaultValue?: string;
		isInvalid?: boolean;
	}>;
	propertiesComponent: React.FC<{ elementInstance: FormElementInstance }>;
	validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
	id: string;
	type: ElementsType;
	extraAttributes?: Record<string, any>;
};

export type FormElementsType = {
	[key in ElementsType]: FormElement;
};
