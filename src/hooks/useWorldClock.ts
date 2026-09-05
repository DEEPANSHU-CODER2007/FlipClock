import { useLocalStorage } from './useLocalStorage';

export interface WorldClockData {
  id: string;
  timezone: string;
  label: string;
}

const DEFAULT_CLOCKS: WorldClockData[] = [
  { id: '1', timezone: 'America/New_York', label: 'New York' },
  { id: '2', timezone: 'Europe/London', label: 'London' },
  { id: '3', timezone: 'Asia/Tokyo', label: 'Tokyo' },
];

export function useWorldClock() {
  const [clocks, setClocks] = useLocalStorage<WorldClockData[]>('flipclock-worldclocks', DEFAULT_CLOCKS);

  const addClock = (timezone: string, label: string) => {
    const newClock = {
      id: Math.random().toString(36).substr(2, 9),
      timezone,
      label,
    };
    setClocks(prev => [...prev, newClock]);
  };

  const removeClock = (id: string) => {
    setClocks(prev => prev.filter(c => c.id !== id));
  };

  return {
    clocks,
    addClock,
    removeClock,
  };
}
