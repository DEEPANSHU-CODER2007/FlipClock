import { useLocalStorage } from './useLocalStorage';

export interface AlarmData {
  id: string;
  hours: number;
  minutes: number;
  isEnabled: boolean;
  snoozeUntil?: number | null;
  lastTriggered?: number | null; // Timestamp - persists across refreshes
}

export function useAlarm() {
  const [alarms, setAlarms] = useLocalStorage<AlarmData[]>('flipclock-alarms-v2', []);

  const addAlarm = (hours: number, minutes: number) => {
    const newAlarm: AlarmData = {
      id: Math.random().toString(36).substr(2, 9),
      hours,
      minutes,
      isEnabled: true,
      snoozeUntil: null,
      lastTriggered: null,
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
    // Disable alarm and record when it last triggered
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, isEnabled: false, snoozeUntil: null, lastTriggered: Date.now() } : a
    ));
  };

  const clearSnooze = (id: string) => {
    // Clear snoozeUntil after snoozed alarm fires, keep alarm enabled for next day
    setAlarms(prev => prev.map(a => 
      a.id === id ? { ...a, snoozeUntil: null, lastTriggered: Date.now() } : a
    ));
  };

  const markTriggered = (id: string) => {
    // Record trigger time in localStorage so refresh doesn't re-fire
    setAlarms(prev => prev.map(a =>
      a.id === id ? { ...a, lastTriggered: Date.now() } : a
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
    markTriggered,
  };
}
