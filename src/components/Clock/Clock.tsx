import React from 'react';
import { useClock } from '../../hooks/useClock';
import { FlipCard } from '../FlipCard/FlipCard';
import { useSettings } from '../../context/SettingsContext';
import './Clock.css';

export const Clock: React.FC = () => {
  const time = useClock();
  const { use24Hour, showSeconds } = useSettings();

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (!use24Hour) {
    hours = hours % 12 || 12;
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  // ALWAYS pad to 06, 09, etc. to prevent layout jumping and keep the premium symmetrical look
  const hourStr = pad(hours);
  const minuteStr = pad(minutes);
  const secondStr = pad(seconds);

  return (
    <div className="clock-container">
      <div className="time-row">
        <FlipCard 
          value={hourStr} 
          cornerLabel={!use24Hour ? ampm : undefined} 
          label="HOURS"
        />
        
        <FlipCard value={minuteStr} label="MINUTES" />
        
        {showSeconds && (
          <FlipCard value={secondStr} label="SECONDS" />
        )}
      </div>
    </div>
  );
};
