interface CountdownTimerProps {
  inputSeconds: string;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  hasStarted: boolean;
  finishFlashKey: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onInputChange: (value: string) => void;
  onQuickSet: (value: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const QUICK_OPTIONS = [
  { label: "2min", value: 120 },
  { label: "2min30s", value: 150 },
  { label: "3min", value: 180 },
  { label: "4min", value: 240 },
];

export default function CountdownTimer({
  inputSeconds,
  remainingSeconds,
  isRunning,
  isFinished,
  hasStarted,
  finishFlashKey,
  collapsed,
  onToggleCollapse,
  onInputChange,
  onQuickSet,
  onStart,
  onPause,
  onReset,
}: CountdownTimerProps): JSX.Element {
  const animationClass = isRunning ? "timer-running" : isFinished ? "timer-finished-once" : "";
  const animationKey = isFinished ? `finish-${finishFlashKey}` : "idle";

  if (collapsed) {
    return (
      <div key={animationKey} className={`timer-shell collapsed ${animationClass}`}>
        <button
          type="button"
          className={`timer-collapsed-button ${isRunning ? "running" : ""}`}
          onClick={onToggleCollapse}
          aria-label="展开计时器"
        >
          <div className="flex h-full w-full flex-col items-center justify-center leading-tight">
            <span className="text-xs font-medium text-[#1d1d1f]">Timer</span>
            {isRunning ? <span className="mt-0.5 text-[11px] text-[#666666]">{remainingSeconds}s</span> : null}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div key={animationKey} className={`timer-shell expanded ${animationClass}`}>
      <div className="timer-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-[#1d1d1f]">Timer</p>
          <button
            type="button"
            className="ui-btn-secondary px-3 py-1 text-xs"
            onClick={onToggleCollapse}
            aria-label="折叠计时器"
          >
            收起
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          {QUICK_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              className="ui-btn-secondary px-2 py-1.5 text-xs"
              onClick={() => onQuickSet(option.value)}
              disabled={hasStarted}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="w-full max-w-[150px]">
            <label className="mb-1 block text-xs text-[#666666]" htmlFor="seconds-input">
              秒数
            </label>
            <input
              id="seconds-input"
              type="text"
              inputMode="numeric"
              value={inputSeconds}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={hasStarted}
              className="w-full rounded-[16px] border border-black/10 bg-white/85 px-3 py-2 text-sm text-[#1d1d1f] outline-none transition focus:border-black/25"
              placeholder="120"
            />
          </div>
          <div className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">{remainingSeconds}s</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="ui-btn px-4 py-2 text-sm" onClick={onStart} disabled={isRunning || remainingSeconds <= 0}>
            开始
          </button>
          <button type="button" className="ui-btn-secondary px-4 py-2 text-sm" onClick={onPause} disabled={!isRunning}>
            暂停
          </button>
          <button type="button" className="ui-btn-secondary px-4 py-2 text-sm" onClick={onReset}>
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
