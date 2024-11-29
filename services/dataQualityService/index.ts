
import { env } from 'next-runtime-env';
import { authorizedApi } from '@/lib';
import type {
    DataQualityServiceProps,
    DataQualityServiceResponse,
} from './types';

/**
 * Serviço para validar dados de qualidade com base no tipo e parâmetro fornecidos.
 * @param type Tipo de validação a ser realizada.
 * @param param Parâmetro a ser validado.
 * @returns Um objeto indicando se o valor é válido e uma mensagem de erro, se aplicável.
 */
export async function validateDataQuality({
    type,
    param,
}: DataQualityServiceProps): Promise<{ isValid: boolean; message: string }> {
    if (!type || !param) {
        throw new Error('Both "type" and "param" are required.');
    }

    const baseUrl = env('NEXT_PUBLIC_CARBON_BASE_URL');
    const endpoint = `${baseUrl}/hub-vendas-carbon/cliente/v1/validacoes/${param}/${type}`;

    try {
        const response = await authorizedApi.get<DataQualityServiceResponse>(endpoint);

        if (response.status !== 200) {
            return {
                isValid: false,
                message: 'Serviço indisponível',
            };
        }

        return {
            isValid: response.data.isValid,
            message: response.data.isValid ? '' : 'Valor inválido',
        };
    } catch (error) {
        console.error('Error in DataQualityService:', error);
        return {
            isValid: false,
            message: 'Erro ao validar dados. Tente novamente mais tarde.',
        };
    }
}
