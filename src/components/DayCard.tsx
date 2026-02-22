import type { DayStatus, PlanDay } from "../types/plan";
import { formatDisplayDate } from "../utils/date";

interface DayCardProps {
  day: PlanDay;
  onChangeStatus: (dateISO: string, status: DayStatus) => void;
}

function statusLabel(status: DayStatus): string {
  if (status === "done") {
    return "已完成";
  }
  if (status === "skipped") {
    return "已跳过";
  }
  return "待处理";
}

function getCardStatusClass(status: DayStatus): string {
  if (status === "done") {
    return "day-done";
  }
  if (status === "skipped") {
    return "day-skipped";
  }
  return "day-pending";
}

export default function DayCard({ day, onChangeStatus }: DayCardProps): JSX.Element {
  const statusClass = getCardStatusClass(day.status);

  return (
    <article className={`day-card p-4 ${statusClass}`}>
      {day.status === "done" ? <span className="day-done-dot" aria-hidden="true" /> : null}
      {day.status === "skipped" ? <span className="day-skipped-overlay" aria-hidden="true" /> : null}

      <div className="day-content">
        <p className="day-subtext text-xs text-[#666666]">{formatDisplayDate(day.date)}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="day-text text-sm font-medium text-[#1d1d1f]">{day.type === "train" ? `训练 · ${day.muscle}` : "休息"}</p>
          <span className="day-subtext text-xs text-[#666666]">{statusLabel(day.status)}</span>
        </div>

        {day.type === "train" ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="ui-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => onChangeStatus(day.date, "pending")}
            >
              待处理
            </button>
            <button
              type="button"
              className="ui-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => onChangeStatus(day.date, "done")}
            >
              完成
            </button>
            <button
              type="button"
              className="ui-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => onChangeStatus(day.date, "skipped")}
            >
              跳过
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              className="ui-btn-secondary px-3 py-1.5 text-xs"
              onClick={() => onChangeStatus(day.date, "done")}
            >
              完成休息
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
