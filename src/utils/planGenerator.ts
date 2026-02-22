import type { FitnessPlanV1, Muscle, PlanDay } from "../types/plan";
import { addDays, startOfLocalDay, toISODateString } from "./date";

interface DayMeta {
  idx: number;
  date: Date;
  weekKey: string;
  reservedRest: boolean;
  assignedMuscle?: Muscle;
}

function getWeekKey(date: Date): string {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = addDays(date, diffToMonday);
  return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

function reserveRestDay(weekDays: DayMeta[]): void {
  let chosen = weekDays.find((d) => d.date.getDay() === 3);
  if (!chosen) {
    chosen = weekDays[Math.floor(weekDays.length / 2)] ?? weekDays[0];
  }
  if (chosen) {
    chosen.reservedRest = true;
  }
}

function canPlaceMuscle(
  muscle: Muscle,
  dayIdx: number,
  weeklyCount: Map<Muscle, number>,
  stageTarget: 1 | 2,
  lastTrainedIndex: Map<Muscle, number>,
): boolean {
  const count = weeklyCount.get(muscle) ?? 0;
  if (count >= stageTarget) {
    return false;
  }

  const previous = lastTrainedIndex.get(muscle);
  if (previous === undefined) {
    return true;
  }

  return dayIdx - previous >= 2;
}

function sortCandidates(
  candidates: Muscle[],
  weeklyCount: Map<Muscle, number>,
  lastTrainedIndex: Map<Muscle, number>,
  orderMap: Map<Muscle, number>,
): Muscle[] {
  return [...candidates].sort((a, b) => {
    const weeklyDiff = (weeklyCount.get(a) ?? 0) - (weeklyCount.get(b) ?? 0);
    if (weeklyDiff !== 0) {
      return weeklyDiff;
    }

    const lastA = lastTrainedIndex.get(a) ?? Number.MIN_SAFE_INTEGER;
    const lastB = lastTrainedIndex.get(b) ?? Number.MIN_SAFE_INTEGER;
    if (lastA !== lastB) {
      return lastA - lastB;
    }

    return (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0);
  });
}

function createDayMeta(startDate: Date): DayMeta[] {
  const normalized = startOfLocalDay(startDate);
  const days: DayMeta[] = [];
  for (let i = 0; i < 28; i += 1) {
    const date = addDays(normalized, i);
    days.push({
      idx: i,
      date,
      weekKey: getWeekKey(date),
      reservedRest: false,
    });
  }
  return days;
}

function splitWeeks(days: DayMeta[]): DayMeta[][] {
  const map = new Map<string, DayMeta[]>();
  days.forEach((day) => {
    const current = map.get(day.weekKey) ?? [];
    current.push(day);
    map.set(day.weekKey, current);
  });
  return [...map.values()];
}

function buildPlanDays(days: DayMeta[]): PlanDay[] {
  return days.map((day) => {
    if (day.assignedMuscle) {
      return {
        date: toISODateString(day.date),
        type: "train",
        muscle: day.assignedMuscle,
        status: "pending",
      };
    }

    return {
      date: toISODateString(day.date),
      type: "rest",
      status: "pending",
    };
  });
}

export function generatePlan(selectedMuscles: Muscle[], startDate: Date): FitnessPlanV1 {
  const days = createDayMeta(startDate);
  const weeks = splitWeeks(days);
  const orderMap = new Map<Muscle, number>(selectedMuscles.map((m, i) => [m, i]));
  const lastTrainedIndex = new Map<Muscle, number>();

  weeks.forEach((weekDays) => {
    reserveRestDay(weekDays);
    const weeklyCount = new Map<Muscle, number>();

    const stages: Array<1 | 2> = [1, 2];

    stages.forEach((stageTarget) => {
      weekDays.forEach((day) => {
        if (day.reservedRest || day.assignedMuscle) {
          return;
        }

        const candidates = selectedMuscles.filter((muscle) =>
          canPlaceMuscle(muscle, day.idx, weeklyCount, stageTarget, lastTrainedIndex),
        );

        if (candidates.length === 0) {
          return;
        }

        const sorted = sortCandidates(candidates, weeklyCount, lastTrainedIndex, orderMap);
        const chosen = sorted[0];

        day.assignedMuscle = chosen;
        weeklyCount.set(chosen, (weeklyCount.get(chosen) ?? 0) + 1);
        lastTrainedIndex.set(chosen, day.idx);
      });
    });
  });

  return {
    createdAt: Date.now(),
    selectedMuscles: [...selectedMuscles],
    days: buildPlanDays(days),
  };
}
