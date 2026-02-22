import { useMemo, useState } from "react";
import type { DayStatus, FitnessPlanV1, Muscle } from "../types/plan";
import { loadPlan, savePlan } from "../utils/storage";
import { generatePlan } from "../utils/planGenerator";

interface UseFitnessPlanResult {
  selectedMuscles: Muscle[];
  setSelectedMuscles: React.Dispatch<React.SetStateAction<Muscle[]>>;
  plan: FitnessPlanV1 | null;
  createPlan: () => boolean;
  regeneratePlan: () => boolean;
  updateDayStatus: (dateISO: string, status: DayStatus) => void;
}

export function useFitnessPlan(): UseFitnessPlanResult {
  const initialPlan = useMemo(() => loadPlan(), []);
  const [plan, setPlan] = useState<FitnessPlanV1 | null>(initialPlan);
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>(initialPlan?.selectedMuscles ?? []);

  const createWithCurrentSelection = (): boolean => {
    if (selectedMuscles.length === 0) {
      return false;
    }

    const next = generatePlan(selectedMuscles, new Date());
    savePlan(next);
    setPlan(next);
    return true;
  };

  const updateDayStatus = (dateISO: string, status: DayStatus): void => {
    setPlan((current) => {
      if (!current) {
        return current;
      }

      const days = current.days.map((day) => {
        if (day.date !== dateISO) {
          return day;
        }

        if (day.type === "rest" && status !== "done") {
          return day;
        }

        return {
          ...day,
          status,
        };
      });

      const next = {
        ...current,
        days,
      };

      savePlan(next);
      return next;
    });
  };

  return {
    selectedMuscles,
    setSelectedMuscles,
    plan,
    createPlan: createWithCurrentSelection,
    regeneratePlan: createWithCurrentSelection,
    updateDayStatus,
  };
}
