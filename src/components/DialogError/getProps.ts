const mapPropsByErrorCode = {
	400: {
		icon: 'icon-porto-ic-fan',
		title: 'Falha na conexão de rede',
		description:
			'Você pode conferir a conexão de sua internet. Se estiver tudo certo, acesse a página novamente.',
		buttonLabel: 'Tentar novamente',
	},
	503: {
		icon: 'icon-porto-ic-wrench-tool',
		title: 'Poxa, nosso sistema está em manutenção',
		subtitle: 'Estamos trabalhando para que volte a funcionar o quanto antes. ',
		description: 'Por favor, tente de novo mais tarde.',
		buttonLabel: 'Ok, entendi',
	},
	default: {
		icon: 'icon-porto-ic-fan',
		title: 'Poxa, nosso sistema está indisponível no momento',
		subtitle: 'Estamos trabalhando para que volte a funcionar o quanto antes.',
		description: 'Por favor, tente de novo mais tarde.',
		buttonLabel: 'Ok, entendi',
	},
};

export const getProps = ({ errorCode }) => {
	return mapPropsByErrorCode[errorCode] || mapPropsByErrorCode.default;
};
