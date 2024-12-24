import { getPageById } from "@/actions/page";

import { FormBuilder } from "@/components";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default async function PageBuilder({ params }: any) {
	const { page } = await getPageById(params.pageId);

	if (!page) {
		throw new Error("Page not found!");
	}

	return <FormBuilder page={page} />;
}
