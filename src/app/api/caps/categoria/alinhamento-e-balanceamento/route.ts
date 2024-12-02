import {
	sectionCardContentSideBySide,
	sectionHowItWorks,
	sectionServiceRequirements,
} from './mockSections';

export async function GET() {
	const data = [
		sectionHowItWorks,
		sectionCardContentSideBySide,
		sectionServiceRequirements,
	];

	const responseJSON = JSON.stringify(data);

	return new Response(responseJSON);
}
