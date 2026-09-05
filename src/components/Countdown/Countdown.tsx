import React, { useState } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { FlipCard } from '../FlipCard/FlipCard';
import './Countdown.css';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const Countdown: React.FC = () => {
  const [inputH, setInputH] = useState(0);
  const [inputM, setInputM] = useState(5);
  const [inputS, setInputS] = useState(0);

  const { hours, minutes, seconds, isRunning, start, pause, reset, setTotalSeconds } = useCountdown(5 * 60);

  const handleSetTimer = () => {
    const total = (inputH * 3600) + (inputM * 60) + inputS;
    setTotalSeconds(total);
  };

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
        <button className="btn btn-secondary" onClick={() => reset()}>
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      {!isRunning && (
        <div className="setup-section">
          <div className="input-group">
            <input type="number" min="0" value={inputH} onChange={e => setInputH(Number(e.target.value))} />
            <span>h</span>
          </div>
          <div className="input-group">
            <input type="number" min="0" max="59" value={inputM} onChange={e => setInputM(Number(e.target.value))} />
            <span>m</span>
          </div>
          <div className="input-group">
            <input type="number" min="0" max="59" value={inputS} onChange={e => setInputS(Number(e.target.value))} />
            <span>s</span>
          </div>
          <button className="btn btn-outline" onClick={handleSetTimer}>Set Timer</button>
        </div>
      )}
    </div>
  );
};
