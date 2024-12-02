import { mockCAPSServices } from './mockCAPSServices';

export async function GET() {
	const responseJSON = JSON.stringify(mockCAPSServices);

	return new Response(responseJSON);
}
