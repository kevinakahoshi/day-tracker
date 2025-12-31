import { Button } from "@/components/ui/button";

type Props = {
	dateStr: string;
	rating?: number | null;
	isFuture?: boolean;
	onClick?: (dateStr: string) => void;
};

export default function DaySquare({
	dateStr,
	rating,
	isFuture,
	onClick,
}: Props) {
	const colors: Record<string, string> = {
		none: "bg-gray-300 dark:bg-gray-700",
		"1": "bg-red-600",
		"2": "bg-red-400",
		"3": "bg-yellow-400",
		"4": "bg-green-300",
		"5": "bg-green-600",
	};

	const cls = rating ? colors[String(rating)] : colors.none;

	return (
		<Button
			asChild={false}
			onClick={() => !isFuture && onClick?.(dateStr)}
			disabled={isFuture}
			title={dateStr}
			variant="ghost"
			size="icon"
			className={`w-8 h-8 p-0 rounded-sm border border-gray-200 dark:border-gray-700 ${cls} disabled:opacity-40`}
		/>
	);
}
