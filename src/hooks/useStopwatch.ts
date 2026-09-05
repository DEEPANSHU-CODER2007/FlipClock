import { useState, useEffect, useCallback, useRef } from 'react';

export function useStopwatch() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setDisplaySeconds(totalSeconds + elapsed);
      }, 200); // 200ms for smooth UI updates
    } else {
      setDisplaySeconds(totalSeconds);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalSeconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTotalSeconds(prev => prev + elapsed);
      setIsRunning(false);
    }
  }, [isRunning]);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(0);
    setDisplaySeconds(0);
  }, []);

  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const seconds = displaySeconds % 60;

  return { hours, minutes, seconds, isRunning, start, pause, reset };
}
