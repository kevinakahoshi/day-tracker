import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import {
  eachDayOfInterval,
  endOfWeek,
  endOfYear,
  format,
  isToday,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { useMemo } from "react";

type DailyEntry = {
  id: number;
  userId: string;
  entryDate: string;
  rating: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ContributionGridProps = {
  year: number;
  entries: DailyEntry[];
  onDayClick: (date: string) => void;
  selectedDate?: string;
};

const getRatingColor = (rating: number): string => {
  switch (rating) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-green-300";
    case 5:
      return "bg-green-700";
    default:
      return "bg-gray-200";
  }
};

const getRatingColorBorder = (rating: number): string => {
  switch (rating) {
    case 1:
      return "border-red-500";
    case 2:
      return "border-orange-500";
    case 3:
      return "border-yellow-500";
    case 4:
      return "border-green-300";
    case 5:
      return "border-green-700";
    default:
      return "border-gray-300";
  }
};

export const ContributionGrid = ({
  year,
  entries,
  onDayClick,
  selectedDate,
}: ContributionGridProps) => {
  const entriesByDate = useMemo(() => {
    const map = new Map<string, DailyEntry>();
    entries.forEach((entry) => {
      map.set(entry.entryDate, entry);
    });
    return map;
  }, [entries]);

  const weeks = useMemo(() => {
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(new Date(year, 0, 1));

    const firstDayOfGrid = startOfWeek(yearStart, { weekStartsOn: 0 });
    const lastDayOfGrid = endOfWeek(yearEnd, { weekStartsOn: 0 });

    const days: Date[] = eachDayOfInterval({
      start: firstDayOfGrid,
      end: lastDayOfGrid,
    });

    // Group days into weeks
    const weekGroups: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekGroups.push(days.slice(i, i + 7) as Date[]);
    }

    return weekGroups;
  }, [year]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{year}</h2>
      <div className="flex flex-col space-y-1 bg-white p-4 rounded-lg">
        {/* Legend */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span>Less</span>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" title="No data"></div>
            <div className="w-4 h-4 bg-red-500 rounded" title="1 - Worst"></div>
            <div className="w-4 h-4 bg-orange-500 rounded" title="2"></div>
            <div
              className="w-4 h-4 bg-yellow-500 rounded"
              title="3 - Medium"
            ></div>
            <div className="w-4 h-4 bg-green-300 rounded" title="4"></div>
            <div
              className="w-4 h-4 bg-green-700 rounded"
              title="5 - Best"
            ></div>
          </div>
          <span>More</span>
        </div>

        {/* Grid with weekday headers on top and weeks as rows (better for mobile) */}
        <TooltipProvider>
          <div className="flex flex-col gap-3">
            {/* Weekday headers */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10" />
              <div className="flex gap-2">
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Sun
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Mon
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Tue
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Wed
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Thu
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Fri
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">
                  Sat
                </div>
              </div>
            </div>

            {/* Weeks rendered as horizontal rows */}
            <div className="flex flex-col gap-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-2 items-center">
                  <div className="w-10 text-xs text-gray-400 text-right">
                    W{weekIndex + 1}
                  </div>
                  <div className="flex gap-2">
                    {week.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const entry = entriesByDate.get(dateStr);
                      const isCurrentYear = day.getFullYear() === year;
                      const isSelected = selectedDate === dateStr;
                      const isTodayDate = isToday(day);

                      return (
                        <div key={dateStr} className="relative">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() =>
                                  isCurrentYear && onDayClick(dateStr)
                                }
                                disabled={!isCurrentYear}
                                aria-label={`${format(day, "MMMM d, yyyy")}${entry ? ` - Rating: ${entry.rating}` : ""}`}
                                className={`
                                  w-6 h-6 rounded-full transition-all
                                ${
                                  isCurrentYear
                                    ? entry
                                      ? getRatingColor(entry.rating)
                                      : "bg-gray-200 hover:bg-gray-300"
                                    : "bg-gray-100"
                                }
                                  ${!isCurrentYear ? "opacity-0 pointer-events-none" : ""}
                                ${!isCurrentYear ? "cursor-not-allowed" : "cursor-pointer"}
                                ${isSelected ? `ring-2 ${entry ? getRatingColorBorder(entry.rating) : "ring-gray-400"}` : "border border-gray-300"}
                                ${isTodayDate ? "ring-1 ring-offset-1 ring-blue-400" : ""}
                              `}
                              />
                            </TooltipTrigger>

                            <TooltipContent side="top">
                              {format(day, "MMMM d, yyyy")}
                              {entry ? ` — Rating: ${entry.rating}` : ""}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};
