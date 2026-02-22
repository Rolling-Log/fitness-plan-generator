import { MUSCLES } from "../constants/muscles";
import type { Muscle } from "../types/plan";

interface MuscleSelectorProps {
  selected: Muscle[];
  onToggle: (muscle: Muscle) => void;
}

export default function MuscleSelector({ selected, onToggle }: MuscleSelectorProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MUSCLES.map((muscle) => {
        const isActive = selected.includes(muscle);

        return (
          <button
            key={muscle}
            type="button"
            onClick={() => onToggle(muscle)}
            className={`rounded-[16px] border px-4 py-3 text-sm transition ${
              isActive
                ? "border-black/30 bg-black text-white"
                : "border-black/10 bg-white/70 text-[#1d1d1f] hover:bg-white/90 hover:border-black/20"
            }`}
          >
            {muscle}
          </button>
        );
      })}
    </div>
  );
}
