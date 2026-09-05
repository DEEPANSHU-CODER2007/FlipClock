import { useState, useEffect, useRef } from 'react';
import { Clock } from './components/Clock/Clock';
import { Countdown } from './components/Countdown/Countdown';
import { Stopwatch } from './components/Stopwatch/Stopwatch';
import { Alarm } from './components/Alarm/Alarm';
import { WorldClock } from './components/WorldClock/WorldClock';
import { ControlBar } from './components/ControlBar/ControlBar';
import { OptionsModal } from './components/OptionsModal/OptionsModal';
import { AboutModal } from './components/AboutModal/AboutModal';
import { useAlarm } from './hooks/useAlarm';

function App() {
  const [activeMode, setActiveMode] = useState<'clock' | 'countdown' | 'stopwatch' | 'alarm' | 'worldclock'>('clock');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Global Fullscreen Hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Alarm Logic
  const { alarms, snoozeAlarm, stopAlarmRing } = useAlarm();
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastTriggeredRef = useRef<{ [key: string]: number }>({});

  // Request Notification Permissions on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!alarmAudioRef.current && typeof window !== 'undefined') {
      // Changed to a much louder mechanical alarm clock sound
      alarmAudioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      alarmAudioRef.current.loop = true;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const nowTime = now.getTime();
      
      const triggeredAlarm = alarms.find(a => {
        if (!a.isEnabled) return false;
        
        // If it's snoozed, check against snooze time instead of base time
        if (a.snoozeUntil) {
          if (nowTime >= a.snoozeUntil) {
            // Check if we already triggered this alarm within the last minute
            if (lastTriggeredRef.current[a.id] && nowTime - lastTriggeredRef.current[a.id] < 60000) return false;
            return true;
          }
          return false;
        }
        
        // Otherwise check exact hour and minute
        if (now.getHours() === a.hours && now.getMinutes() === a.minutes) {
          // Check if we already triggered this alarm within the last minute
          if (lastTriggeredRef.current[a.id] && nowTime - lastTriggeredRef.current[a.id] < 60000) return false;
          return true;
        }
        
        return false;
      });

      if (triggeredAlarm && ringingAlarmId !== triggeredAlarm.id) {
        lastTriggeredRef.current[triggeredAlarm.id] = nowTime;
        setRingingAlarmId(triggeredAlarm.id);
        if (alarmAudioRef.current) {
          alarmAudioRef.current.currentTime = 0;
          alarmAudioRef.current.play().catch(() => {});
        }

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('ALARM RINGING!', {
            body: `It's ${String(triggeredAlarm.hours).padStart(2, '0')}:${String(triggeredAlarm.minutes).padStart(2, '0')}. Time to wake up!`,
            requireInteraction: true
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, ringingAlarmId]);

  const handleStopAlarm = () => {
    if (ringingAlarmId) stopAlarmRing(ringingAlarmId);
    setRingingAlarmId(null);
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
  };

  const handleSnooze = () => {
    if (ringingAlarmId) snoozeAlarm(ringingAlarmId, 5); // 5 minutes
    setRingingAlarmId(null);
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <main className="flex-center" style={{ flex: 1, paddingBottom: '80px' }}>
        {activeMode === 'clock' && <Clock />}
        {activeMode === 'countdown' && <Countdown />}
        {activeMode === 'stopwatch' && <Stopwatch />}
        {activeMode === 'alarm' && <Alarm />}
        {activeMode === 'worldclock' && <WorldClock />}
      </main>

      {/* Global Alarm Ringing Overlay */}
      {ringingAlarmId && (
        <div className="modal-overlay" style={{ zIndex: 1000, backdropFilter: 'blur(15px)', backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-content" style={{ textAlign: 'center', padding: '60px' }}>
            <h1 style={{ fontSize: '56px', color: '#f5f5f5', marginBottom: '16px', letterSpacing: '4px' }}>WAKE UP</h1>
            <p style={{ color: '#a0a0a0', marginBottom: '48px', fontSize: '20px' }}>Your alarm is ringing!</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ fontSize: '20px', padding: '16px 32px' }} onClick={handleSnooze}>
                Snooze (5m)
              </button>
              <button className="btn btn-warning" style={{ fontSize: '20px', padding: '16px 48px' }} onClick={handleStopAlarm}>
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      <ControlBar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        onOpenOptions={() => setIsOptionsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <OptionsModal isOpen={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}

export default App;
