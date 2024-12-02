'use client';
import * as TextareaOcean from '@porto-ocean/textarea';
import { useEffect, useState } from 'react';

import { sanitize } from '@/utils';

export const Textarea = ({
	label,
	placeholder,
	className,
	rows,
	maxChars = 200,
	helperText,
	errorMessage,
	value,
	disabled,
	onChange,
}: TextareaProps) => {
	const [internalValue, setInternalValue] = useState(value || '');
	const currentValue = disabled
		? ''
		: value !== undefined
			? value
			: internalValue;

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;

		if (newValue.length <= maxChars) {
			if (onChange) {
				const sanitizeValue = sanitize(newValue);
				onChange(sanitizeValue);
			}
			setInternalValue(newValue);
		}
	};

	useEffect(() => {
		if (value !== undefined) {
			const sanitizeValue = sanitize(value);
			setInternalValue(sanitizeValue);
		}
	}, [value]);

	return (
		<TextareaOcean.Root className={className}>
			<div>
				<TextareaOcean.Label>{label}</TextareaOcean.Label>
				<TextareaOcean.Field
					placeholder={placeholder}
					rows={Number.parseInt(rows, 10)}
					value={currentValue}
					onChange={handleChange}
					disabled={disabled}
				/>
			</div>

			<TextareaOcean.Counter>
				{currentValue.length}/{maxChars}
			</TextareaOcean.Counter>

			{errorMessage && (
				<TextareaOcean.ErrorMessage>{errorMessage}</TextareaOcean.ErrorMessage>
			)}

			{helperText && (
				<TextareaOcean.HelperText>{helperText}</TextareaOcean.HelperText>
			)}
		</TextareaOcean.Root>
	);
};
