import React from 'react';
import { useSettings, type Theme } from '../../context/SettingsContext';
import { X } from 'lucide-react';
import './OptionsModal.css';
import classNames from 'classnames';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({ isOpen, onClose }) => {
  const { 
    use24Hour, setUse24Hour, 
    showSeconds, setShowSeconds, 
    animationEnabled, setAnimationEnabled,
    soundEnabled, setSoundEnabled, 
    theme, setTheme 
  } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Options</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="setting-group">
            <label className="setting-label">Time Format</label>
            <div className="toggle-group">
              <button 
                className={classNames('toggle-btn', { active: !use24Hour })}
                onClick={() => setUse24Hour(false)}
              >12-hour</button>
              <button 
                className={classNames('toggle-btn', { active: use24Hour })}
                onClick={() => setUse24Hour(true)}
              >24-hour</button>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Display</label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showSeconds} onChange={e => setShowSeconds(e.target.checked)} />
              Show Seconds
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-label">Effects</label>
            <label className="checkbox-label">
              <input type="checkbox" checked={animationEnabled} onChange={e => setAnimationEnabled(e.target.checked)} />
              Flip Animation
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
              Flip Sound
            </label>
          </div>

          <div className="setting-group">
            <label className="setting-label">Theme</label>
            <select 
              className="theme-select" 
              value={theme} 
              onChange={e => setTheme(e.target.value as Theme)}
            >
              <option value="dark">Dark</option>
              <option value="midnight">Midnight</option>
              <option value="amoled">AMOLED (Pure Black)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
