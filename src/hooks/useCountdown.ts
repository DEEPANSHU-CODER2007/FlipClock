import { useState, useEffect, useCallback, useRef } from 'react';

export function useCountdown(initialTotalSeconds: number = 0) {
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(initialTotalSeconds);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setDisplaySeconds(totalSeconds);
    }
  }, [totalSeconds, isRunning]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && totalSeconds > 0) {
      endTimeRef.current = Date.now() + (totalSeconds * 1000);
      
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current! - Date.now()) / 1000));
        setDisplaySeconds(remaining);
        
        if (remaining <= 0) {
          setIsRunning(false);
          setTotalSeconds(0);
        }
      }, 200);
    } else if (totalSeconds === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalSeconds]);

  const start = useCallback(() => setIsRunning(true), []);
  
  const pause = useCallback(() => {
    if (isRunning && endTimeRef.current) {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTotalSeconds(remaining);
      setIsRunning(false);
    }
  }, [isRunning]);
  
  const reset = useCallback((newTotal: number = initialTotalSeconds) => {
    setIsRunning(false);
    setTotalSeconds(newTotal);
    setDisplaySeconds(newTotal);
  }, [initialTotalSeconds]);

  const handleSetTotalSeconds = useCallback((newTotal: number) => {
    setIsRunning(false);
    setTotalSeconds(newTotal);
  }, []);

  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const seconds = displaySeconds % 60;

  return { hours, minutes, seconds, isRunning, start, pause, reset, setTotalSeconds: handleSetTotalSeconds };
}
