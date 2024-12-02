import {
	BannerCarousel,
	FloatButton,
	SectionBannerBody,
	SectionBannerHero,
	SectionBreadcrumb,
	SectionCardContentSideBySide,
	SectionCardPriceWithText,
	SectionCardsContent,
	SectionCardsTestimonial,
	SectionCepWithCardPrice,
	SectionCustomData,
	SectionFaq,
	SectionFooter,
	SectionHowItWorks,
	SectionProductsByCategory,
	SectionProductsHighlight,
	SectionServiceRequirements,
	SectionTermsOfUse,
	SectionTextBody,
	SectionVideo,
} from '@/components';

export const DynamicSectionComponent: any = {
	section_custom_data: (props: any) => <SectionCustomData {...props} />,
	section_banner_carousel: (props: any) => <BannerCarousel {...props} />,
	section_cep_with_card_price: (props: any) => (
		<SectionCepWithCardPrice {...props} />
	),
	section_breadcrumb: (props: any) => <SectionBreadcrumb {...props} />,
	section_banner_hero: (props: any) => <SectionBannerHero {...props} />,
	section_products_by_category: (props: any) => (
		<SectionProductsByCategory {...props} />
	),
	section_products_highlight: (props: any) => (
		<SectionProductsHighlight {...props} />
	),
	section_banner_body: (props: any) => <SectionBannerBody {...props} />,
	section_faq: (props: any) => <SectionFaq {...props} />,
	section_card_content: (props: any) => <SectionCardsContent {...props} />,
	section_card_content_side_by_side: (props: any) => (
		<SectionCardContentSideBySide {...props} />
	),
	section_cards_carousel_testimonial: (props: any) => (
		<SectionCardsTestimonial {...props} />
	),
	section_terms_of_use: (props: any) => <SectionTermsOfUse {...props} />,
	section_footer: (props: any) => <SectionFooter {...props} />,
	section_how_it_works: (props: any) => <SectionHowItWorks {...props} />,
	section_service_requirements: (props) => (
		<SectionServiceRequirements {...props} />
	),
	section_video: (props: any) => <SectionVideo {...props} />,
	section_float_button: (props: any) => <FloatButton {...props} />,
	section_card_price_with_text: (props: any) => (
		<SectionCardPriceWithText {...props} />
	),
	section_text_body: (props: any) => <SectionTextBody {...props} />,
};
