import { useMemo, useState } from "react";
import MuscleSelector from "./components/MuscleSelector";
import PlanActions from "./components/PlanActions";
import PlanCalendar from "./components/PlanCalendar";
import CountdownTimer from "./components/CountdownTimer";
import Section from "./components/Section";
import { useFitnessPlan } from "./hooks/useFitnessPlan";
import { useCountdown } from "./hooks/useCountdown";
import type { Muscle } from "./types/plan";

export default function App(): JSX.Element {
  const { selectedMuscles, setSelectedMuscles, plan, createPlan, regeneratePlan, updateDayStatus } = useFitnessPlan();
  const [isTimerCollapsed, setIsTimerCollapsed] = useState(true);

  const {
    inputSeconds,
    setInputSeconds,
    quickSetSeconds,
    remainingSeconds,
    isRunning,
    isFinished,
    hasStarted,
    finishFlashKey,
    start,
    pause,
    reset,
  } = useCountdown(120);

  const canCreate = selectedMuscles.length > 0;

  const createdAtText = useMemo(() => {
    if (!plan) {
      return "尚未生成计划";
    }
    return `创建时间：${new Date(plan.createdAt).toLocaleString()}`;
  }, [plan]);

  const toggleMuscle = (muscle: Muscle): void => {
    setSelectedMuscles((current) => {
      if (current.includes(muscle)) {
        return current.filter((m) => m !== muscle);
      }
      return [...current, muscle];
    });
  };

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-8 pb-40 sm:px-6 sm:pb-32 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">Fitness Plan Generator</h1>
          <p className="mt-2 text-sm text-[#666666]">
            纯前端 28 天健身计划工具，数据仅保存在本地浏览器，不依赖后端或在线服务。
          </p>
        </header>

        <div className="grid gap-5">
          <Section title="训练设置" description={createdAtText} level="glass-level-1">
            <MuscleSelector selected={selectedMuscles} onToggle={toggleMuscle} />
            <PlanActions
              hasPlan={Boolean(plan)}
              canCreate={canCreate}
              onGenerate={createPlan}
              onRegenerate={regeneratePlan}
            />
          </Section>

          <Section title="28 天计划" description="每天最多一个训练部位。休息日仅可标记为完成。" level="glass-level-2">
            {plan ? (
              <PlanCalendar days={plan.days} onChangeStatus={updateDayStatus} />
            ) : (
              <div className="rounded-[16px] border border-dashed border-black/10 bg-white/70 p-8 text-center text-sm text-[#666666]">
                请先选择训练部位并生成计划。
              </div>
            )}
          </Section>
        </div>
      </main>

      <div className="timer-float">
        <CountdownTimer
          inputSeconds={inputSeconds}
          remainingSeconds={remainingSeconds}
          isRunning={isRunning}
          isFinished={isFinished}
          hasStarted={hasStarted}
          finishFlashKey={finishFlashKey}
          collapsed={isTimerCollapsed}
          onToggleCollapse={() => setIsTimerCollapsed((prev) => !prev)}
          onInputChange={setInputSeconds}
          onQuickSet={quickSetSeconds}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
      </div>
    </>
  );
}
