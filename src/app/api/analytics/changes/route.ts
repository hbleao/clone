import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PageChange, PageAnalytics } from "@/types/analytics";

export async function POST(request: Request) {
	try {
		const change: PageChange = await request.json();

		const savedChange = await prisma.pageChange.create({
			data: {
				id: change.id,
				pageId: change.pageId,
				pageName: change.pageName,
				timestamp: change.timestamp,
				userId: change.userId,
				userName: change.userName,
				action: change.action,
				changeData: JSON.stringify(change.changeData),
			},
		});

		return NextResponse.json(savedChange);
	} catch (error) {
		console.error("Error saving page change:", error);
		return NextResponse.json(
			{ error: "Failed to save page change" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const appId = searchParams.get("appId");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const users = searchParams.getAll("users");

		console.log("Analytics API called with params:", {
			appId,
			startDate,
			endDate,
			users,
		});

		if (!appId) {
			return NextResponse.json(
				{ error: "appId is required" },
				{ status: 400 },
			);
		}

		const where: any = {
			pageId: {
				startsWith: appId,
			},
		};

		if (startDate) {
			where.timestamp = {
				...where.timestamp,
				gte: new Date(startDate),
			};
		}

		if (endDate) {
			where.timestamp = {
				...where.timestamp,
				lte: new Date(endDate),
			};
		}

		if (users.length > 0) {
			where.userId = {
				in: users,
			};
		}

		console.log("Prisma where clause:", where);

		const changes = await prisma.pageChange.findMany({
			where,
			orderBy: {
				timestamp: "asc",
			},
		});

		console.log(`Found ${changes.length} changes`);

		// Se não houver mudanças, retornar dados vazios mas válidos
		if (changes.length === 0) {
			return NextResponse.json({
				totalChanges: 0,
				changesByDate: [],
				changesByUser: [],
				mostEditedSections: [],
			});
		}

		// Agrupa as mudanças por data
		const changesByDate = changes.reduce((acc: any[], change) => {
			const date = change.timestamp.toISOString().split("T")[0];
			const existingDate = acc.find((item) => item.date === date);

			if (existingDate) {
				existingDate.changes += 1;
			} else {
				acc.push({ date, changes: 1 });
			}

			return acc;
		}, []);

		// Agrupa as mudanças por usuário
		const changesByUser = changes.reduce((acc: any[], change) => {
			const existingUser = acc.find((item) => item.userId === change.userId);

			if (existingUser) {
				existingUser.changes += 1;
			} else {
				acc.push({
					userId: change.userId,
					userName: change.userName,
					changes: 1,
				});
			}

			return acc;
		}, []);

		// Encontra as seções mais editadas
		const mostEditedSections = changes
			.reduce((acc: any[], change) => {
				try {
					const changeData = JSON.parse(change.changeData as string);
					if (changeData.differences) {
						changeData.differences.forEach((section: string) => {
							const existingSection = acc.find(
								(item) => item.sectionName === section,
							);

							if (existingSection) {
								existingSection.changes += 1;
							} else {
								acc.push({
									sectionName: section,
									changes: 1,
								});
							}
						});
					}
				} catch (error) {
					console.error("Error parsing changeData:", error);
				}
				return acc;
			}, [])
			.sort((a, b) => b.changes - a.changes)
			.slice(0, 10);

		const analytics: PageAnalytics = {
			totalChanges: changes.length,
			changesByDate,
			changesByUser,
			mostEditedSections,
		};

		return NextResponse.json(analytics);
	} catch (error) {
		console.error("Error fetching analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch analytics" },
			{ status: 500 },
		);
	}
}
