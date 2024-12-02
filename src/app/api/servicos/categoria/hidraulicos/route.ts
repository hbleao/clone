import {
	SectionCepWithCardPrice,
	customData,
	sectionBannerBody,
	sectionBannerCarousel,
	sectionBreadcrumb,
	sectionCardContentSideBySide,
	sectionCardTestimonial,
	sectionFaq,
	sectionHowItWorks,
	sectionServiceRequirements,
	sectionTermsOfUse,
	sectionVideo,
} from './mockSections';

export async function GET() {
	const data = [
		customData,
		sectionBreadcrumb,
		sectionBannerCarousel,
		SectionCepWithCardPrice,
		sectionBannerBody,
		sectionVideo,
		sectionHowItWorks,
		sectionCardContentSideBySide,
		sectionServiceRequirements,
		sectionCardTestimonial,
		sectionFaq,
		sectionTermsOfUse,
	];

	const responseJSON = JSON.stringify(data);

	return new Response(responseJSON);
}
