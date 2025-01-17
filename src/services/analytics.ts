import { v4 as uuid } from "uuid";
import type { PageAnalytics, PageChange } from "../types/analytics";

export const savePageChange = async (change: Omit<PageChange, "id">) => {
	try {
		const response = await fetch("/api/analytics/changes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...change, id: uuid() }),
		});

		if (!response.ok) {
			throw new Error("Failed to save page change");
		}

		return await response.json();
	} catch (error) {
		console.error("Error saving page change:", error);
		throw error;
	}
};

export const getPageAnalytics = async (
	appId: string,
	filters: {
		startDate?: Date;
		endDate?: Date;
		users?: string[];
	},
): Promise<PageAnalytics> => {
	const params = new URLSearchParams();

	params.append("appId", appId);

	if (filters.startDate) {
		params.append("startDate", filters.startDate.toISOString());
	}
	if (filters.endDate) {
		params.append("endDate", filters.endDate.toISOString());
	}
	if (filters.users?.length) {
		filters.users.forEach((user) => params.append("users", user));
	}

	const response = await fetch(`/api/analytics/changes?${params}`);

	if (!response.ok) {
		const errorData = await response.json();
		console.error("Analytics API error:", errorData);
		throw new Error("Failed to fetch analytics");
	}

	const data = await response.json();
	return data;
};

export const trackPageCopy = async (
	pageId: string,
	pageName: string,
	userId: string,
	userName: string,
	pageData: any[],
) => {
	return savePageChange({
		pageId,
		pageName,
		timestamp: new Date(),
		userId,
		userName,
		action: "copy",
		changeData: {
			newVersion: JSON.stringify(pageData),
		},
	});
};
