import { mockWorkshopCar } from '@/app/api/caps/workshop/mockWorkshopCar';
import { calculateDistance } from '@/utils/calculateDistance';
import { type NextRequest, NextResponse } from 'next/server';

const MAX_RESULTS = 20;

const parseCoordinate = (coordinate: string): number => {
	return Number.parseFloat(coordinate.replace(',', '.'));
};

export async function GET(req: NextRequest) {
	const lat = req.nextUrl.searchParams.get('lat');
	const lng = req.nextUrl.searchParams.get('lng');

	if (!lat || !lng) {
		return NextResponse.json(mockWorkshopCar, { status: 200 });
	}

	const userLat = parseCoordinate(lat as string);
	const userLng = parseCoordinate(lng as string);

	const workshopsWithDistance = mockWorkshopCar.map((workshop) => {
		const workshopLat = parseCoordinate(workshop.latitude);
		const workshopLng = parseCoordinate(workshop.longitude);
		const distance = calculateDistance(
			userLat,
			userLng,
			workshopLat,
			workshopLng,
		);
		return { ...workshop, distance };
	});

	const sortedWorkshops = workshopsWithDistance
		.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
		.map((workshop) => ({
			...workshop,
			distance: `${workshop.distance.toFixed(1)} km`,
		}))
		.slice(0, MAX_RESULTS);

	return NextResponse.json(sortedWorkshops, { status: 200 });
}
