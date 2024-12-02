import { NextResponse } from 'next/server';

export function middleware(request) {
	const url = request.nextUrl;

	if (url.pathname === '/loja/servicos/agendamento') {
		const response = NextResponse.next();

		response.cookies.delete('shopping_token');
		response.cookies.delete('nom_enc_sms');
		response.cookies.delete('tax_enc_sms');
		response.cookies.delete('em_enc_sms');
		response.cookies.delete('sid_enc_sms');
		response.cookies.delete('mob_enc_sms');

		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/servicos/:path*',
};
