type TInstallmentData = {
	installment: {
		[key: number]: string;
	};
};

export function getInstallmentText(data: TInstallmentData) {
	const values = Object.entries(data.installment);
	const lastItem = values.at(-1);
	const [, installmentValue] = lastItem as unknown as [string, number];
	const formattedValue = new Intl.NumberFormat('pt-BR').format(
		installmentValue,
	);

	return `${values.length}x R$ ${formattedValue} sem juros`;
}
