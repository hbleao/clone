/** @type {import('next').NextConfig} */
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const path = require('path');

const nextConfig = {
	distDir: '/dist/react-ssr-corp-psrv-porto-servicos',
	output: 'standalone',
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.portoseguro.com.br',
			},
			{
				protocol: 'https',
				hostname: 'servicos.hub-de-vendas-ecommerce.dev.awsporto',
			},
			{
				protocol: 'https',
				hostname: 'servicos.hub-de-vendas-ecommerce.hml.awsporto',
			},
			{
				protocol: 'https',
				hostname: 'servicos.hub-de-vendas-ecommerce.prd.awsporto',
			},
		],
	},
	env: {
		NEXT_PUBLIC_API_NEXT_BASE_URL: process.env.NEXT_PUBLIC_API_NEXT_BASE_URL,
	},
	experimental: {
		optimizeCss: true,
	},
	poweredByHeader: false,
	async headers() {
		return [
			{
				source: '/:all*(svg|jpg|png)',
				locale: false,
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, must-revalidate',
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
