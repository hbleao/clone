declare global {
	interface Window {
		dataLayer: any[];
	}
}

export interface DataLayerEvent {
	event: string;
	[key: string]: any;
}

export function setupDataLayer(): void {
	if (typeof window === 'undefined') return;
	window.dataLayer = window.dataLayer || [];
}

export function pushToDataLayer(event: DataLayerEvent): void {
	if (typeof window === 'undefined') return;

	try {
		setupDataLayer();
		window.dataLayer.push(event);
	} catch (error) {
		console.error('Error pushing to dataLayer:', error);
	}
}

export function clearDataLayer(): void {
	if (typeof window === 'undefined') return;

	try {
		window.dataLayer = [];
	} catch (error) {
		console.error('Error clearing dataLayer:', error);
	}
}
