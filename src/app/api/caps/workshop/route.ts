import { mockWorkshopCar } from './mockWorkshopCar';

export async function GET() {
	const responseJSON = JSON.stringify(mockWorkshopCar);

	return new Response(responseJSON);
}
