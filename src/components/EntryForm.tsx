import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { Slider } from "#/components/ui/slider";
import { Textarea } from "#/components/ui/textarea";
import { format, parseISO } from "date-fns";
import type React from "react";
import { useId, useState } from "react";

type DailyEntry = {
  id: number;
  userId: string;
  entryDate: string;
  rating: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type EntryFormProps = {
  date?: string;
  onSubmit: (data: {
    entryDate: string;
    rating: number;
    note?: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialEntry?: DailyEntry;
  isLoading?: boolean;
};

const getRatingLabel = (rating: number): string => {
  switch (rating) {
    case 1:
      return "Terrible";
    case 2:
      return "Bad";
    case 3:
      return "OK";
    case 4:
      return "Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
};

const getRatingColor = (rating: number): string => {
  switch (rating) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-orange-500";
    case 3:
      return "text-yellow-500";
    case 4:
      return "text-green-300";
    case 5:
      return "text-green-700";
    default:
      return "text-gray-500";
  }
};

export const EntryForm = ({
  date,
  onSubmit,
  onCancel,
  initialEntry,
  isLoading = false,
}: EntryFormProps) => {
  const [rating, setRating] = useState(initialEntry?.rating || 3);
  const [note, setNote] = useState(initialEntry?.note || "");
  const [error, setError] = useState("");
  const sliderId = useId();
  const noteId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!date) {
      setError("No date selected");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }

    try {
      await onSubmit({
        entryDate: date,
        rating,
        note: note.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Date: {date && format(parseISO(date), "MMMM d, yyyy")}
        </Label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={sliderId} className="text-lg font-semibold">
            How are you feeling?{" "}
            <span className={`${getRatingColor(rating)} font-bold`}>
              ({getRatingLabel(rating)})
            </span>
          </Label>
          <div className="flex items-center justify-between gap-4">
            <Slider
              id={sliderId}
              min={1}
              max={5}
              step={1}
              value={[rating]}
              onValueChange={(value: number[]) => setRating(value[0])}
              className="flex-1"
            />
            <div className="text-3xl font-bold w-12 text-center">{rating}</div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Worst</span>
            <span>Best</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={noteId} className="text-lg font-semibold">
            Add a note (optional)
          </Label>
          <Textarea
            id={noteId}
            placeholder="What happened today? How did you feel?"
            value={note}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNote(e.target.value)
            }
            className="min-h-[120px] resize-none"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
