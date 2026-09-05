import React, { useEffect, useState, useRef } from 'react';
import './FlipCard.css';
import { useSettings } from '../../context/SettingsContext';

interface FlipCardProps {
  value: string;
  cornerLabel?: string;
  label?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ value, cornerLabel, label }) => {
  const { animationEnabled, soundEnabled } = useSettings();
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio('https://raw.githubusercontent.com/Deepanshu/flipclock-assets/main/flip.mp3');
      audioRef.current.volume = 0.2;
    }
  }, []);

  useEffect(() => {
    if (!animationEnabled) {
      setCurrentValue(value);
      setNextValue(value);
      setIsFlipping(false);
      return;
    }

    if (value === nextValue) return;

    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;

    // 1. Reset state in case a flip is already running
    setIsFlipping(false); 

    // 2. Start flip after a tiny delay to allow the DOM to reset
    timeout1 = setTimeout(() => {
      setNextValue(value); // Set this AT THE SAME TIME as isFlipping to prevent flashing
      setIsFlipping(true);
      
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      
      // 3. Finish flip and sync current value
      timeout2 = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 400); // 400ms matches the CSS animation duration
    }, 20);

    return () => {
      // Cleanup prevents race conditions and permanently stuck cards
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      
      // If interrupted, fast-forward to the target value immediately
      setCurrentValue(value);
      setNextValue(value);
      setIsFlipping(false);
    };
  }, [value, animationEnabled, soundEnabled]); // Removed currentValue from dependencies!

  return (
    <div className="flip-card-container">
      <div className="flip-card">
        {/* Static Top */}
        <div className="card-top">
          <div className="num">{nextValue}</div>
        </div>

        {/* Static Bottom */}
        <div className="card-bottom">
          <div className="num">{currentValue}</div>
        </div>

        {/* Animated Flaps */}
        {isFlipping && (
          <>
            <div className="flap flap-top">
              <div className="num">{currentValue}</div>
            </div>
            <div className="flap flap-bottom">
              <div className="num">{nextValue}</div>
            </div>
          </>
        )}

        <div className="divider" />

        {cornerLabel && <div className="corner-label">{cornerLabel}</div>}
      </div>

      {label && <div className="bottom-label">{label}</div>}
    </div>
  );
};
