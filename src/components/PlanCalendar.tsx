import type { DayStatus, PlanDay } from "../types/plan";
import DayCard from "./DayCard";

interface PlanCalendarProps {
  days: PlanDay[];
  onChangeStatus: (dateISO: string, status: DayStatus) => void;
}

export default function PlanCalendar({ days, onChangeStatus }: PlanCalendarProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {days.map((day) => (
        <DayCard key={day.date} day={day} onChangeStatus={onChangeStatus} />
      ))}
    </div>
  );
}
