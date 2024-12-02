import type { ModalProps } from '../types';

export interface ModalWithoutCepProps {
	modal: ModalProps;
	token?: string;
	handleCloseModal: () => void;
	handleCallBackCep: (cep: string) => void;
}

export interface StateProps {
	ativo: boolean;
	codigoEstado: number;
	nomeEstado: string;
	siglaEstado: string;
	siglaEstadoOrigemExterna: string;
}

export interface CepProps {
	isChecked: boolean;
	codigoLogradouro: number;
	nomeLogradouro: string;
	nomeAbreviadoLogradouro: string;
	numeroCepLogradouro: string;
	numeroCepComplementoLogradouro: string;
	textoComplementoLogradouro?: string;
	codigoLogradouroOrigemExterna: number;
	tipoEnderecamentoPostal: {
		codigoTipoEnderecamentoPostal: number;
		nomeTipoEnderecamentoPostal: string;
	};
	tipoLogradouro: {
		codigoTipoLogradouro: number;
		nomeTipoLogradouro: string;
		siglaTipoLogradouro: string;
	};
	bairro: {
		codigoBairro: number;
		nomeBairro: string;
	};
	localidade: {
		codigoLocalidade: number;
		nomeLocalidade: string;
		nomeAbreviadoLocalidade: string;
		codigoLocalidadeOrigemExterna: number;
		tipoSituacaoLocalidade: {
			codigoTipoSituacaoLocalidade: number;
			descricaoTipoSituacaoLocalidade: string;
			ativo: boolean;
		};
		estado: {
			codigoEstado: number;
			nomeEstado: string;
			siglaEstado: string;
			siglaEstadoOrigemExterna: string;
			ativo: boolean;
		};
		codigoLocalidadeMunicipioIbge: string;
		tipoLocalidade: {
			codigoTipoLocalidade: number;
			nomeTipoLocalidade: string;
			codigoTipoLocalidadeOrigemExterna: string;
			ativo: true;
		};
		ativo: true;
	};
	ativo: boolean;
	codigoTipoEnderecamentoPostal: number;
}
