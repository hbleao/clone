import { NextResponse } from 'next/server';
import { mockWorkshopCar } from '../../mockWorkshopCar';
import holidaysBR from './holidays';

const DAYS_TO_ADD = 3;
const DAYS_TO_SHOW = 15;

function getWeekday(date: Date): string {
	const options = { weekday: 'long' as const };
	return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

function getMonthName(date: Date): string {
	const options = { month: 'long' as const };
	return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

function getMonthNumber(date: Date): number {
	return date.getMonth() + 1;
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

interface Schedule {
	time: string;
	serviceDateTime: string;
}

interface AvailableDate {
	day: number;
	month: string;
	selected: boolean;
	weekday: string;
	schedules: Schedule[];
}

function generateSchedule(
	day: number,
	monthNumber: number,
	year: number,
	isSaturday: boolean,
): Schedule[] {
	const morningSchedule: Schedule = {
		time: 'Manhã',
		serviceDateTime: `${formatDatePart(day)}/${formatDatePart(
			monthNumber,
		)}/${year} Manhã`,
	};
	const afternoonSchedule: Schedule = {
		time: 'Tarde',
		serviceDateTime: `${formatDatePart(day)}/${formatDatePart(
			monthNumber,
		)}/${year} Tarde`,
	};

	return isSaturday ? [morningSchedule] : [morningSchedule, afternoonSchedule];
}

function isSaturday(dayOfWeek: number): boolean {
	return dayOfWeek === 6;
}

function isSunday(dayOfWeek: number): boolean {
	return dayOfWeek === 0;
}

function formatDatePart(number: number): string {
	return number.toString().padStart(2, '0');
}

function formatDate(date: Date): string {
	return `${formatDatePart(date.getDate())}/${formatDatePart(date.getMonth() + 1)}`;
}

function isHoliday(date: Date): boolean {
	const formattedDate = formatDate(date);
	return holidaysBR.includes(formattedDate);
}

function isValidWorkingDay(date: Date, workshop: any): boolean {
	const dayOfWeek = date.getDay();
	const isSaturdayWithoutWork =
		isSaturday(dayOfWeek) && !workshop.workingSaturday;

	return !isSunday(dayOfWeek) && !isSaturdayWithoutWork && !isHoliday(date);
}

function getAvailableDates(workshop: any, today: Date): AvailableDate[] {
	const availableDates: AvailableDate[] = [];
	let addedDays = 0;
	let i = DAYS_TO_ADD;

	while (addedDays < DAYS_TO_SHOW) {
		const currentDate = new Date(today);
		currentDate.setDate(today.getDate() + i);

		if (!isValidWorkingDay(currentDate, workshop)) {
			i++;
			continue;
		}

		const day = currentDate.getDate();
		const monthName = capitalize(getMonthName(currentDate));
		const monthNumber = getMonthNumber(currentDate);
		const weekday = capitalize(getWeekday(currentDate));

		const schedules = generateSchedule(
			day,
			monthNumber,
			currentDate.getFullYear(),
			isSaturday(currentDate.getDay()),
		);

		availableDates.push({
			day,
			month: monthName,
			selected: false,
			weekday,
			schedules,
		});

		addedDays++;
		i++;
	}

	return availableDates;
}

export async function GET(
	_: Request,
	{ params }: { params: { code: string } },
) {
	const { code } = params;
	const workshop = mockWorkshopCar.find((w) => w.code === code);

	if (!workshop) {
		return NextResponse.json(
			{ error: 'Oficina não encontrada' },
			{ status: 404 },
		);
	}

	const today = new Date();
	const availableDates = getAvailableDates(workshop, today);

	return NextResponse.json(availableDates, { status: 200 });
}
