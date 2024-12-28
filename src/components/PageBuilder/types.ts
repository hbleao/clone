import type { Page } from "@prisma/client";
import type { FormElementInstance } from "@/components";

export type PageWithParsedContent = Omit<Page, "content"> & {
	content: FormElementInstance[];
};

export type PageBuilderProps = {
	page: PageWithParsedContent;
};
