import { useEffect, useMemo, useState } from "react";

interface UseCountdownResult {
  inputSeconds: string;
  setInputSeconds: (value: string) => void;
  quickSetSeconds: (value: number) => void;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  hasStarted: boolean;
  finishFlashKey: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdown(defaultSeconds = 120): UseCountdownResult {
  const initial = useMemo(() => defaultSeconds, [defaultSeconds]);
  const [inputSeconds, setInputSecondsState] = useState(String(initial));
  const [remainingSeconds, setRemainingSeconds] = useState(initial);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [finishFlashKey, setFinishFlashKey] = useState(0);

  const setInputSeconds = (value: string): void => {
    if (hasStarted) {
      return;
    }

    const sanitized = value.replace(/[^0-9]/g, "");
    setInputSecondsState(sanitized);

    const parsed = Number(sanitized);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setRemainingSeconds(parsed);
    }
  };

  const quickSetSeconds = (value: number): void => {
    if (hasStarted || value <= 0) {
      return;
    }

    setInputSecondsState(String(value));
    setRemainingSeconds(value);
  };

  const start = (): void => {
    if (isRunning) {
      return;
    }

    const parsed = Number(inputSeconds);
    const baseline = Number.isNaN(parsed) || parsed <= 0 ? initial : parsed;

    if (!hasStarted) {
      setRemainingSeconds(baseline);
      setHasStarted(true);
    }

    if (remainingSeconds <= 0 && hasStarted) {
      return;
    }

    setIsFinished(false);
    setIsRunning(true);
  };

  const pause = (): void => {
    setIsRunning(false);
  };

  const reset = (): void => {
    const parsed = Number(inputSeconds);
    const baseline = Number.isNaN(parsed) || parsed <= 0 ? initial : parsed;
    setIsRunning(false);
    setIsFinished(false);
    setHasStarted(false);
    setRemainingSeconds(baseline);
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setIsFinished(true);
          setFinishFlashKey((prev) => prev + 1);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  return {
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
  };
}
