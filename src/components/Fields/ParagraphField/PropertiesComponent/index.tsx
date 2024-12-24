'use client';
import { type FormEvent, useEffect, useState } from 'react';

import s from './styles.module.scss';

import { useDesigner } from '@/hooks';

import { Button, Input } from '@/components';

import type { FormElementInstance } from '@/components/FormElements';

export type PropertiesComponentProps = {
	elementInstance: FormElementInstance;
};

export const PropertiesComponent = ({
	elementInstance,
}: PropertiesComponentProps) => {
	const { updateElement } = useDesigner();
	const [text, setText] = useState('');

	const handleSubmit = (e: FormEvent) => {
		if (!elementInstance) return;

		e.preventDefault();
		updateElement(elementInstance?.id, {
			...elementInstance,
			extraAttributes: {
				...elementInstance?.extraAttributes,
				text,
			},
		});
	};

	useEffect(() => {
		setText(elementInstance?.extraAttributes?.title);
	}, [elementInstance]);

	return (
		<div>
			<form onSubmit={handleSubmit} className={s.form}>
				<div className={s.field}>
					<Input
						label="Label"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<span className={s.text}>The label of the field</span>
				</div>

				<div style={{ marginTop: '8px' }} />

				<Button type="submit" size="md" width="fluid">
					Save changes
				</Button>
			</form>
		</div>
	);
};
