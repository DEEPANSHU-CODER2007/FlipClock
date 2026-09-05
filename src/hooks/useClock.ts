import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Sync to the exact next second for precise flipping
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();
    
    let interval: ReturnType<typeof setInterval>;
    
    const timeout = setTimeout(() => {
      setTime(new Date());
      interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return time;
}
