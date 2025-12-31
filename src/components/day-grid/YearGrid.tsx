import React, { useMemo, useRef, useState } from "react";
import DaySquare from "./DaySquare";
import RatingModal from "./RatingModal";
import {
	getYearRatings,
	upsertRating,
	exportYear,
} from "@/routes/api/day-ratings";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

type RatingRow = { day: string; rating?: number | null; note?: string | null };

function generateDatesForYear(year: number) {
	const start = new Date(Date.UTC(year, 0, 1));
	const end = new Date(Date.UTC(year, 11, 31));
	const dates: string[] = [];
	for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
		dates.push(new Date(d).toISOString().slice(0, 10));
	}
	return dates;
}

export default function YearGrid({ year }: { year: number }) {
	const [ratings, setRatings] = React.useState<Record<string, RatingRow>>({});
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const gridRef = useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const rows = await getYearRatings({ input: { year } });
				if (!mounted) return;
				const map: Record<string, RatingRow> = {};
				for (const r of rows) {
					const dayObj = new Date((r as any).day);
					const day = dayObj.toISOString().slice(0, 10);
					map[day] = {
						day,
						rating: (r as any).rating ?? null,
						note: (r as any).note ?? null,
					};
				}
				setRatings(map);
			} catch (err) {
				console.error(err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [year]);

	const dates = useMemo(() => generateDatesForYear(year), [year]);

	const handleClick = (dateStr: string) => {
		setSelectedDate(dateStr);
		setModalOpen(true);
	};

	const handleSave = async ({
		day,
		rating,
		note,
	}: {
		day: string;
		rating: number | null;
		note?: string | null;
	}) => {
		await upsertRating({ data: { day, rating, note } });
		setRatings((s) => ({ ...s, [day]: { day, rating, note } }));
		setModalOpen(false);
	};

	const today = new Date().toISOString().slice(0, 10);

	return (
		<div>
			<div ref={gridRef} className="grid grid-cols-7 gap-1">
				{dates.map((d) => {
					const isFuture = d > today;
					const r = ratings[d];
					return (
						<DaySquare
							key={d}
							dateStr={d}
							rating={r?.rating ?? null}
							isFuture={isFuture}
							onClick={handleClick}
						/>
					);
				})}
			</div>

			<div className="mt-4 flex gap-2">
				<Button
					variant="outline"
					onClick={async () => {
						const csv = await exportYear({ input: { year, format: "csv" } });
						const blob = new Blob([String(csv)], { type: "text/csv" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = `day-ratings-${year}.csv`;
						a.click();
						URL.revokeObjectURL(url);
					}}
				>
					Export CSV
				</Button>

				<Button
					variant="default"
					onClick={async () => {
						if (!gridRef.current) return;
						try {
							const canvas = await html2canvas(gridRef.current, {
								backgroundColor: null,
								scale: 2,
							});
							canvas.toBlob((blob) => {
								if (!blob) return;
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = `day-ratings-${year}.png`;
								a.click();
								URL.revokeObjectURL(url);
							});
						} catch (err) {
							console.error("Failed to export image", err);
						}
					}}
				>
					Export PNG
				</Button>
			</div>

			<RatingModal
				open={modalOpen}
				dateStr={selectedDate}
				rating={selectedDate ? (ratings[selectedDate]?.rating ?? null) : null}
				note={selectedDate ? (ratings[selectedDate]?.note ?? null) : null}
				onClose={() => setModalOpen(false)}
				onSave={handleSave}
			/>
		</div>
	);
}
