import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import YearGrid from "@/components/day-grid/YearGrid";

export const Route = createFileRoute("/day/year")({
	component: DayYearPage,
});

function DayYearPage() {
	const params = useParams();
	const year = Number(params.year) || new Date().getFullYear();

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Day Tracker — {year}</h1>
			<YearGrid year={year} />
		</div>
	)
}

export default null;
