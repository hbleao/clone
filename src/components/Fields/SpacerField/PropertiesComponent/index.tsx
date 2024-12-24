'use client';
import { type FormEvent, useEffect, useState } from 'react';

import s from './styles.module.scss';

import { useDesigner } from '@/hooks';

import { Button } from '@/components';

import type { FormElementInstance } from '@/components/FormElements';

export type PropertiesComponentProps = {
	elementInstance: FormElementInstance;
};

export const PropertiesComponent = ({
	elementInstance,
}: PropertiesComponentProps) => {
	const { updateElement } = useDesigner();
	const [height, setHeight] = useState('20');

	const handleSubmit = (e: FormEvent) => {
		if (!elementInstance) return;

		e.preventDefault();
		updateElement(elementInstance?.id, {
			...elementInstance,
			extraAttributes: {
				...elementInstance?.extraAttributes,
				height,
			},
		});
	};

	useEffect(() => {
		setHeight(elementInstance?.extraAttributes?.height);
	}, [elementInstance]);

	return (
		<div>
			<form onSubmit={handleSubmit} className={s.form}>
				<div className={s.field}>
					<p>Height: {height}px</p>
					<input
						type="range"
						id="spacer"
						name="spacer"
						min="0"
						max="200"
						step="10"
						defaultValue="20"
						value={height}
						onChange={(e) => setHeight(e.target.value)}
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
