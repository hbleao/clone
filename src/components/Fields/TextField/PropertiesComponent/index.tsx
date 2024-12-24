'use client';
import { type FormEvent, useEffect, useState } from 'react';

import s from './styles.module.scss';

import { useDesigner } from '@/hooks';

import { Button, Input, Switch } from '@/components';
import type { FormElementInstance } from '@/components/FormElements';

export const PropertiesComponent = ({
	elementInstance,
}: { elementInstance: FormElementInstance }) => {
	const { updateElement } = useDesigner();
	const [label, setLabel] = useState('');
	const [placeholder, setPlaceholder] = useState('');
	const [helperText, setHelperText] = useState('');
	const [required, setRequired] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		if (!elementInstance) return;

		e.preventDefault();
		updateElement(elementInstance?.id, {
			...elementInstance,
			extraAttributes: {
				...elementInstance?.extraAttributes,
				label,
				placeholder,
				helperText,
				required,
			},
		});
	};

	useEffect(() => {
		setLabel(elementInstance?.extraAttributes?.label);
		setPlaceholder(elementInstance?.extraAttributes?.placeholder);
		setHelperText(elementInstance?.extraAttributes?.helperText);
		setRequired(elementInstance?.extraAttributes?.required);
	}, [elementInstance]);

	return (
		<div>
			<form onSubmit={handleSubmit} className={s.form}>
				<div className={s.field}>
					<Input
						label="Label"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
					/>
					<span className={s.text}>The label of the field</span>
				</div>
				<div className={s.field}>
					<Input
						label="Placeholder"
						value={placeholder}
						onChange={(e) => setPlaceholder(e.target.value)}
					/>
					<span className={s.text}>The placeholder of the field</span>
				</div>

				<div className={s.field}>
					<Input
						label="HelperText"
						value={helperText}
						onChange={(e) => setHelperText(e.target.value)}
					/>
					<span className={s.text}>
						The helper text of the field. <br /> It will be displayed bellow the
						field
					</span>
				</div>

				<div className={s.switchContainer}>
					<div className={s.switchHeader}>
						<strong className={s.switchTitle}>Required</strong>
						<span className={s.text}>
							The helper text of the field. it will be displayed bellow the
							field
						</span>
					</div>
					<Switch
						value={required}
						onClick={() => setRequired(!required)}
						onKeyDown={() => setRequired(!required)}
					/>
				</div>

				<div style={{ marginTop: '8px' }} />

				<Button type="submit" size="md" width="fluid">
					Save changes
				</Button>
			</form>
		</div>
	);
};
