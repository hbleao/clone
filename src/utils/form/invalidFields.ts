type Fields = Record<string, string>;

/**
 * Checks if any field in the object has a non-empty value.
 * @param fields - An object where keys are field names and values are strings.
 * @returns The fields object if any field is invalid, otherwise false.
 */
export function isInvalidFields(fields: Fields): boolean | Fields {
	const entries = Object.entries(fields);
	const hasInvalidField = entries.some(([, value]) => value !== '');

	return hasInvalidField ? fields : false;
}
