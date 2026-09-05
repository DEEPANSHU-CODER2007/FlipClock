import React from 'react';
import { useStopwatch } from '../../hooks/useStopwatch';
import { FlipCard } from '../FlipCard/FlipCard';
import '../Countdown/Countdown.css';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const { hours, minutes, seconds, isRunning, start, pause, reset } = useStopwatch();

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="countdown-container">
      <div className="time-row">
        <FlipCard value={pad(hours)} label="HOURS" />
        <FlipCard value={pad(minutes)} label="MINUTES" />
        <FlipCard value={pad(seconds)} label="SECONDS" />
      </div>

      <div className="controls">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={start}>
            <Play size={20} /> Start
          </button>
        ) : (
          <button className="btn btn-warning" onClick={pause}>
            <Pause size={20} /> Pause
          </button>
        )}
        <button className="btn btn-secondary" onClick={reset}>
          <RotateCcw size={20} /> Reset
        </button>
      </div>
    </div>
  );
};
