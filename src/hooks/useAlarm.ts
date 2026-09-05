import { useLocalStorage } from './useLocalStorage';

export interface AlarmData {
  id: string;
  hours: number;
  minutes: number;
  isEnabled: boolean;
  snoozeUntil?: number | null; // Timestamp
}

export function useAlarm() {
  const [alarms, setAlarms] = useLocalStorage<AlarmData[]>('flipclock-alarms-v2', []);

  const addAlarm = (hours: number, minutes: number) => {
    // Use simple string random for id if uuid is not available
    const newAlarm: AlarmData = {
      id: Math.random().toString(36).substr(2, 9),
      hours,
      minutes,
      isEnabled: true,
      snoozeUntil: null,
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const toggleAlarm = (id: string, enabled: boolean) => {
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, isEnabled: enabled, snoozeUntil: null } : a
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const snoozeAlarm = (id: string, minutesToSnooze: number = 5) => {
    const snoozeTime = Date.now() + (minutesToSnooze * 60 * 1000);
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, snoozeUntil: snoozeTime } : a
    ));
  };

  const stopAlarmRing = (id: string) => {
    // Disable alarm so it doesn't ring again today
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, isEnabled: false, snoozeUntil: null } : a
    ));
  };

  const clearSnooze = (id: string) => {
    // Clear snoozeUntil after snoozed alarm fires, keep alarm enabled for next day
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, snoozeUntil: null } : a
    ));
  };

  return {
    alarms,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
    snoozeAlarm,
    stopAlarmRing,
    clearSnooze,
  };
}
