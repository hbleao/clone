"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	LineChart,
	BarChart,
	Line,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";

import styles from "./styles.module.scss";

import { getPageAnalytics } from "@/services/analytics";
import type { PageAnalytics } from "@/types/analytics";
import { DashboardLayout, Spinner } from "@/components";

export default function AnalyticsPage() {
	const params = useParams();
	const [dateRange, setDateRange] = useState({
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
	});
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [analytics, setAnalytics] = useState<PageAnalytics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				setIsLoading(true);
				setError(null);

				console.log("Fetching analytics for app:", params.slug);
				const data = await getPageAnalytics(params.slug as string, {
					startDate: dateRange.startDate,
					endDate: dateRange.endDate,
				});
				console.log("Analytics data received:", data);

				setAnalytics(data);
			} catch (error) {
				console.error("Error fetching analytics:", error);
				setError("Falha ao carregar os dados de analytics");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalytics();
	}, [dateRange, params.slug]);

	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<Spinner size="md" />
					<p>Carregando dados de analytics...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<div className={styles.errorContent}>
					<p>{error}</p>
					<button onClick={() => window.location.reload()}>
						Tentar novamente
					</button>
				</div>
			</div>
		);
	}

	console.log("Rendering analytics with data:", analytics);

	return (
		<DashboardLayout slug={params.slug}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1>Analytics de Páginas</h1>
				</div>

				<div className={styles.dateFilters}>
					<div className={styles.dateField}>
						<label>Data Inicial</label>
						<input
							type="date"
							value={format(dateRange.startDate, "yyyy-MM-dd")}
							onChange={(e) =>
								setDateRange((prev) => ({
									...prev,
									startDate: new Date(e.target.value),
								}))
							}
						/>
					</div>
					<div className={styles.dateField}>
						<label>Data Final</label>
						<input
							type="date"
							value={format(dateRange.endDate, "yyyy-MM-dd")}
							onChange={(e) =>
								setDateRange((prev) => ({
									...prev,
									endDate: new Date(e.target.value),
								}))
							}
						/>
					</div>
				</div>

				{analytics && (
					<div className={styles.chartsGrid}>
						<div className={styles.chartCard}>
							<h2>Alterações por Data</h2>
							{analytics.changesByDate.length > 0 ? (
								<div className={styles.chartContainer}>
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={analytics.changesByDate}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis
												dataKey="date"
												tickFormatter={(value) =>
													format(new Date(value), "dd/MM", { locale: ptBR })
												}
											/>
											<YAxis />
											<Tooltip
												labelFormatter={(value) =>
													format(new Date(value), "dd/MM/yyyy", {
														locale: ptBR,
													})
												}
											/>
											<Legend />
											<Line
												type="monotone"
												dataKey="changes"
												name="Alterações"
												stroke="#3B82F6"
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>Nenhuma alteração encontrada neste período</p>
								</div>
							)}
						</div>

						<div className={styles.chartCard}>
							<h2>Alterações por Usuário</h2>
							{analytics.changesByUser.length > 0 ? (
								<div className={styles.chartContainer}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={analytics.changesByUser}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="userName" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar dataKey="changes" name="Alterações" fill="#10B981" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>Nenhuma alteração encontrada neste período</p>
								</div>
							)}
						</div>

						<div className={styles.chartCard}>
							<h2>Seções Mais Editadas</h2>
							{analytics.mostEditedSections.length > 0 ? (
								<div className={styles.chartContainer}>
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={analytics.mostEditedSections}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="sectionName" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar dataKey="changes" name="Alterações" fill="#6366F1" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>Nenhuma seção editada neste período</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
