import React, { useState, useEffect } from 'react';
import { useWorldClock } from '../../hooks/useWorldClock';
import { useSettings } from '../../context/SettingsContext';
import { Plus, X, Trash2 } from 'lucide-react';
import './WorldClock.css';

// A predefined list of common timezones for the dropdown
const COMMON_TIMEZONES = [
  { tz: 'America/Los_Angeles', label: 'Los Angeles' },
  { tz: 'America/New_York', label: 'New York' },
  { tz: 'Europe/London', label: 'London' },
  { tz: 'Europe/Paris', label: 'Paris' },
  { tz: 'Asia/Dubai', label: 'Dubai' },
  { tz: 'Asia/Tokyo', label: 'Tokyo' },
  { tz: 'Australia/Sydney', label: 'Sydney' },
];

export const WorldClock: React.FC = () => {
  const { clocks, addClock, removeClock } = useWorldClock();
  const { use24Hour } = useSettings();
  
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTz, setSelectedTz] = useState(COMMON_TIMEZONES[0].tz);

  // We need to re-render every minute to keep world clocks updated
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    const tzObj = COMMON_TIMEZONES.find(t => t.tz === selectedTz);
    if (tzObj) {
      addClock(tzObj.tz, tzObj.label);
    }
    setIsAdding(false);
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="worldclock-container">
      <div className="worldclock-header">
        <h2>World Clock</h2>
        <button className="btn btn-icon" onClick={() => setIsAdding(true)}>
          <Plus size={24} />
        </button>
      </div>

      <div className="worldclock-grid">
        {clocks.map(clock => {
          // Calculate time for this timezone
          const date = new Date();
          const options: Intl.DateTimeFormatOptions = { 
            timeZone: clock.timezone,
            hour12: false,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          };
          const timeString = new Intl.DateTimeFormat('en-US', options).format(date);
          const [h, m] = timeString.split(':').map(Number);
          
          let displayH = h;
          const ampm = h >= 12 ? 'PM' : 'AM';
          if (!use24Hour) {
            displayH = h % 12 || 12;
          }

          return (
            <div key={clock.id} className="worldclock-card">
              <div className="card-header">
                <h3>{clock.label}</h3>
                <button className="btn-icon delete-sm" onClick={() => removeClock(clock.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mini-clock">
                <div className="mini-card">
                  <span className="num">{pad(displayH)}</span>
                </div>
                <div className="colon">:</div>
                <div className="mini-card">
                  <span className="num">{pad(m)}</span>
                </div>
                {!use24Hour && <span className="world-ampm">{ampm}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content add-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add City</h3>
              <button className="btn-icon" onClick={() => setIsAdding(false)}><X size={24} /></button>
            </div>
            
            <div className="input-group" style={{ margin: '32px 0' }}>
              <select 
                value={selectedTz} 
                onChange={(e) => setSelectedTz(e.target.value)}
                className="tz-select"
              >
                {COMMON_TIMEZONES.map(tz => (
                  <option key={tz.tz} value={tz.tz}>{tz.label}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary full-width" onClick={handleAdd}>Add Clock</button>
          </div>
        </div>
      )}
    </div>
  );
};
