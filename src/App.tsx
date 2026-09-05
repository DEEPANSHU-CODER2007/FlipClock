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

// --- Web Audio Alarm Generator (no network needed, works even in background tabs) ---
function createAlarmSound(ctx: AudioContext): () => void {
  let stopped = false;
  const beep = () => {
    if (stopped) return;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
    if (!stopped) {
      setTimeout(beep, 600);
    }
  };
  beep();
  return () => { stopped = true; };
}

function App() {
  const [activeMode, setActiveMode] = useState<'clock' | 'countdown' | 'stopwatch' | 'alarm' | 'worldclock'>('clock');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Create AudioContext immediately — it starts suspended, resume on user interaction
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopAlarmSoundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Create AudioContext on mount (requires user gesture to resume, but we can create it)
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch(e) {}
    
    // Resume AudioContext on every click/keydown (browsers require this)
    const handler = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener('click', handler);
    window.addEventListener('touchstart', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

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

  // Request Notification Permissions on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Global Alarm Logic
  const { alarms, snoozeAlarm, stopAlarmRing, clearSnooze } = useAlarm();
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);

  // Use refs so the interval always reads fresh data WITHOUT needing to recreate
  const alarmsRef = useRef(alarms);
  const ringingAlarmIdRef = useRef(ringingAlarmId);

  useEffect(() => { alarmsRef.current = alarms; }, [alarms]);
  useEffect(() => { ringingAlarmIdRef.current = ringingAlarmId; }, [ringingAlarmId]);

  // STABLE interval — created ONCE on mount, reads fresh data via refs
  // This prevents missed alarms when interval gets recreated
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowTime = now.getTime();
      const currentAlarms = alarmsRef.current;
      const currentRingingId = ringingAlarmIdRef.current;

      const triggeredAlarm = currentAlarms.find(a => {
        if (!a.isEnabled) return false;

        // Check if explicitly dismissed for this alarm slot
        const dismissedAt = Number(localStorage.getItem(`alarm-dismissed-${a.id}`) || 0);
        if (dismissedAt > 0) {
          const d = new Date(dismissedAt);
          if (d.getHours() === a.hours && d.getMinutes() === a.minutes) return false;
        }

        // Prevent rapid re-trigger within 90 seconds
        const lastFired = Number(localStorage.getItem(`alarm-fired-${a.id}`) || 0);
        if (nowTime - lastFired < 90000) return false;

        if (a.snoozeUntil) return nowTime >= a.snoozeUntil;

        return now.getHours() === a.hours && now.getMinutes() === a.minutes;
      });

      if (triggeredAlarm && currentRingingId !== triggeredAlarm.id) {
        localStorage.setItem(`alarm-fired-${triggeredAlarm.id}`, String(nowTime));
        setRingingAlarmId(triggeredAlarm.id);

        if (triggeredAlarm.snoozeUntil) clearSnooze(triggeredAlarm.id);

        // Play alarm sound
        const ctx = audioCtxRef.current;
        if (ctx) {
          const play = () => { stopAlarmSoundRef.current = createAlarmSound(ctx); };
          ctx.state === 'suspended' ? ctx.resume().then(play) : play();
        }

        // System notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ ALARM!', {
            body: `It's ${String(triggeredAlarm.hours).padStart(2,'0')}:${String(triggeredAlarm.minutes).padStart(2,'0')} — Time to wake up!`,
            requireInteraction: true
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps = stable, never recreated

  const stopSound = () => {
    if (stopAlarmSoundRef.current) {
      stopAlarmSoundRef.current();
      stopAlarmSoundRef.current = null;
    }
  };

  const handleStopAlarm = () => {
    if (ringingAlarmId) {
      // Write dismissed key SYNCHRONOUSLY so refresh won't re-trigger
      localStorage.setItem(`alarm-dismissed-${ringingAlarmId}`, String(Date.now()));
      stopAlarmRing(ringingAlarmId);
    }
    setRingingAlarmId(null);
    stopSound();
  };

  const handleSnooze = () => {
    if (ringingAlarmId) {
      // Clear dismissed key so snooze can re-fire
      localStorage.removeItem(`alarm-dismissed-${ringingAlarmId}`);
      snoozeAlarm(ringingAlarmId, 5);
    }
    setRingingAlarmId(null);
    stopSound();
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
        <div className="modal-overlay" style={{ zIndex: 1000, backdropFilter: 'blur(15px)', backgroundColor: 'rgba(0,0,0,0.90)' }}>
          <div className="modal-content" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>⏰</div>
            <h1 style={{ fontSize: '56px', color: '#f5f5f5', marginBottom: '16px', letterSpacing: '4px' }}>WAKE UP!</h1>
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
