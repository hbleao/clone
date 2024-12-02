import { formatGtm } from '@/utils';

export function setDataLayerList(products, title, selectedCategory) {
	window.dataLayer.push({
		event: 'view_item_list',
		ev_action: 'ecommerce:visualizar:lista-produtos:sucesso',
		ev_detail: `categoria:${formatGtm(selectedCategory)}`,
		items: products.map((product) => ({
			item_id: product.sku,
			item_name: 'servicos-para-casa-e-auto',
			item_category: product.alias,
			item_brand: 'porto',
			item_variant: formatGtm(selectedCategory),
			item_list_name: `${formatGtm(title)}:${product.alias}`,
			price: product?.cardPrice?.price,
			quantity: 1,
			affiliation: 'porto',
		})),
	});
}

export function setDataLayerListError(error) {
	window.dataLayer.push({
		event: 'alert',
		ev_action: 'ecommerce:visualizar:lista-produtos:alert',
		ev_label: 'poxa, nosso sistema está indisponível no momento',
		alert_event: 'erro',
		alert_code: error?.status,
		error_service: 'ServiceProductByCategory',
		alert_service_message: error?.message,
		client_id: '',
		client_bcp: '',
	});
}
