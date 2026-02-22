export type Muscle = "肩" | "背" | "胸" | "腿" | "二头" | "三头" | "腹";

export type DayType = "train" | "rest";

export type DayStatus = "pending" | "done" | "skipped";

export interface PlanDay {
  date: string;
  type: DayType;
  muscle?: Muscle;
  status: DayStatus;
}

export interface FitnessPlanV1 {
  createdAt: number;
  selectedMuscles: Muscle[];
  days: PlanDay[];
}
