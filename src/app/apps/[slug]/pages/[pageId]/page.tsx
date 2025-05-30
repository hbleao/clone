import { getPageById } from "@/actions/page";
import { PageBuilder } from "@/components";
import type { PageWithParsedContent } from "@/components/PageBuilder/types";
import { ToggleExample } from './toggle-example';

interface PageBuilderProps {
	params: {
		pageId: string;
	};
}

export default async function PageBuilderById({ params }: PageBuilderProps) {
	const result = await getPageById(params.pageId);

	if (!result.success || !result.page) {
		throw new Error("Page not found!");
	}

	return (
		<div>
			<ToggleExample />
			<PageBuilder page={result.page as PageWithParsedContent} />
		</div>
	);
}
