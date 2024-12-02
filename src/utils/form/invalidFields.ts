type isInvalidFieldsProps = {
	[key: string]: string;
};

export function isInvalidFields(
	fields: isInvalidFieldsProps,
): boolean | isInvalidFieldsProps {
	const arrayFields = Object.entries(fields);
	const validation = arrayFields.every((field) => field[1] === '');

	return !validation ? fields : false;
}
