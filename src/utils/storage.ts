import { STORAGE_KEY } from "../constants/storage";
import type { DayStatus, FitnessPlanV1, Muscle, PlanDay } from "../types/plan";

function isMuscle(value: unknown): value is Muscle {
  return ["肩", "背", "胸", "腿", "二头", "三头", "腹"].includes(String(value));
}

function isDayStatus(value: unknown): value is DayStatus {
  return value === "pending" || value === "done" || value === "skipped";
}

function isPlanDay(value: unknown): value is PlanDay {
  if (!value || typeof value !== "object") {
    return false;
  }

  const day = value as Partial<PlanDay>;
  if (typeof day.date !== "string") {
    return false;
  }
  if (day.type !== "train" && day.type !== "rest") {
    return false;
  }
  if (!isDayStatus(day.status)) {
    return false;
  }
  if (day.type === "train" && !isMuscle(day.muscle)) {
    return false;
  }

  return true;
}

function isFitnessPlan(value: unknown): value is FitnessPlanV1 {
  if (!value || typeof value !== "object") {
    return false;
  }

  const plan = value as Partial<FitnessPlanV1>;
  if (typeof plan.createdAt !== "number") {
    return false;
  }
  if (!Array.isArray(plan.selectedMuscles) || !plan.selectedMuscles.every(isMuscle)) {
    return false;
  }
  if (!Array.isArray(plan.days) || plan.days.length !== 28 || !plan.days.every(isPlanDay)) {
    return false;
  }

  return true;
}

export function loadPlan(): FitnessPlanV1 | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isFitnessPlan(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function savePlan(plan: FitnessPlanV1): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function clearPlan(): void {
  localStorage.removeItem(STORAGE_KEY);
}
