'use client';

import s from './styles.module.scss';

import type {
	FormElementInstance,
	SubmitFunction,
} from '@/components/FormElements';

import { Input, TextFieldFormElement } from '@/components';
import { useEffect, useState } from 'react';

export const FormComponent = ({
	elementInstance,
	submitValue,
	defaultValue = '',
	isInvalid,
}: {
	elementInstance: FormElementInstance;
	submitValue?: SubmitFunction;
	defaultValue?: string;
	isInvalid?: boolean;
}) => {
	const [value, setValue] = useState(defaultValue);
	const [isError, setIsError] = useState(false);
	const { label, required, placeholder, helperText } =
		elementInstance.extraAttributes as any;
	const errorClass = isError ?? s.error;

	useEffect(() => {
		setIsError(isInvalid === true);
	}, [isInvalid]);

	return (
		<div className={`${s.designerComponent} ${errorClass}`}>
			<Input
				label={required ? `${label} *` : label}
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					if (!submitValue) return;
					const valid = TextFieldFormElement.validate(
						elementInstance,
						e.target.value,
					);
					setIsError(!valid);
					if (!valid) return;
					submitValue(elementInstance.id, e.target.value);
				}}
			/>
			{helperText && !isError && <p className={s.helperText}>{helperText}</p>}
			{isError && <p className={s.error}>Field is required</p>}
		</div>
	);
};
