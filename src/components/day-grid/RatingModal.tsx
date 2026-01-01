import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type Props = {
	open: boolean;
	dateStr: string | null;
	rating?: number | null;
	note?: string | null;
	onClose: () => void;
	onSave: (payload: {
		day: string;
		rating: number | null;
		note?: string | null;
	}) => void;
};

export default function RatingModal({
	open,
	dateStr,
	rating,
	note,
	onClose,
	onSave,
}: Props) {
	const ratingRef = useRef<HTMLSelectElement | null>(null);
	const noteRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		if (open) {
			ratingRef.current?.focus();
		}
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg w-[320px] shadow-lg">
				<h3 className="text-lg font-semibold mb-2">Rate {dateStr}</h3>
				<div className="mb-3">
					<label className="block text-sm mb-1">Rating</label>
					<select
						ref={ratingRef}
						defaultValue={rating ?? ""}
						className="w-full p-2 border rounded"
					>
						<option value="">No rating</option>
						<option value="1">1 — Worst</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5 — Best</option>
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-sm mb-1">Note (optional)</label>
					<textarea
						ref={noteRef}
						defaultValue={note ?? ""}
						className="w-full p-2 border rounded h-20"
					/>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const val = ratingRef.current?.value;
							const noteVal = noteRef.current?.value;
							const parsed = val === "" ? null : Number(val);
							if (!dateStr) return;
							onSave({ day: dateStr, rating: parsed, note: noteVal ?? null });
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
