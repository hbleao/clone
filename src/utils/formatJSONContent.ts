export const formatJSONContent = (pageContent: any) => {
  const formattedContent =
		pageContent?.content?.sections?.map((item, index) => {
			const pageName =
				pageContent.content.sections[index].template.name.toLowerCase();
			return {
				name: pageName,
				component: { ...item.content },
			};
		}) || [];
		
	const jsonContent = JSON.stringify(
		{
			seo: {
				title: pageContent?.seo?.title || "",
				description: pageContent?.seo?.description || "",
				canonical: pageContent?.seo?.canonical || "",
			},
			data: formattedContent,
		},
		null,
		2,
	);

  return jsonContent;
}