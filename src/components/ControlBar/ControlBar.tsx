import React from 'react';
import { Clock, Timer, Hourglass, Bell, Globe, Maximize, Settings, Info, Minimize } from 'lucide-react';
import './ControlBar.css';
import classNames from 'classnames';

interface ControlBarProps {
  activeMode: 'clock' | 'countdown' | 'stopwatch' | 'alarm' | 'worldclock';
  setActiveMode: (mode: 'clock' | 'countdown' | 'stopwatch' | 'alarm' | 'worldclock') => void;
  onOpenOptions: () => void;
  onOpenAbout: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ activeMode, setActiveMode, onOpenOptions, onOpenAbout }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="control-bar">
      <div className="control-group left">
        <button 
          className={classNames('control-btn', { active: activeMode === 'clock' })}
          onClick={() => setActiveMode('clock')}
        >
          <Clock size={20} />
          <span>Clock</span>
        </button>
        <button 
          className={classNames('control-btn', { active: activeMode === 'countdown' })}
          onClick={() => setActiveMode('countdown')}
        >
          <Hourglass size={20} />
          <span>Countdown</span>
        </button>
        <button 
          className={classNames('control-btn', { active: activeMode === 'stopwatch' })}
          onClick={() => setActiveMode('stopwatch')}
        >
          <Timer size={20} />
          <span>Stopwatch</span>
        </button>
        <button 
          className={classNames('control-btn', { active: activeMode === 'alarm' })}
          onClick={() => setActiveMode('alarm')}
        >
          <Bell size={20} />
          <span>Alarm</span>
        </button>
        <button 
          className={classNames('control-btn', { active: activeMode === 'worldclock' })}
          onClick={() => setActiveMode('worldclock')}
        >
          <Globe size={20} />
          <span>World</span>
        </button>
      </div>
      
      <div className="control-group right">
        <button className="control-btn icon-only" onClick={toggleFullscreen} title="Fullscreen">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button className="control-btn icon-only" onClick={onOpenOptions} title="Settings">
          <Settings size={20} />
        </button>
        <button className="control-btn icon-only" onClick={onOpenAbout} title="About">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};
