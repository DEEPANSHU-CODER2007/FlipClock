import React, { useState } from 'react';
import { useAlarm } from '../../hooks/useAlarm';
import { useSettings } from '../../context/SettingsContext';
import { Plus, X } from 'lucide-react';
import './Alarm.css';

export const Alarm: React.FC = () => {
  const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useAlarm();
  const { use24Hour } = useSettings();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [inputH, setInputH] = useState(7);
  const [inputM, setInputM] = useState(0);
  const [inputAmPm, setInputAmPm] = useState<'AM' | 'PM'>('AM');

  const openAddModal = () => {
    setEditingId(null);
    setInputH(use24Hour ? 7 : 7);
    setInputM(0);
    setInputAmPm('AM');
    setIsModalOpen(true);
  };

  const openEditModal = (alarm: any) => {
    setEditingId(alarm.id);
    
    let displayH = alarm.hours;
    let ampm: 'AM' | 'PM' = alarm.hours >= 12 ? 'PM' : 'AM';
    
    if (!use24Hour) {
      displayH = alarm.hours % 12 || 12;
    }
    
    setInputH(displayH);
    setInputM(alarm.minutes);
    setInputAmPm(ampm);
    setIsModalOpen(true);
  };

  const handleTestSound = (e: React.MouseEvent) => {
    e.preventDefault();
    const testAudio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
    testAudio.play().catch(() => {
      alert("Audio blocked by browser! Please allow audio permissions for this site.");
    });
    // Stop after 2 seconds
    setTimeout(() => {
      testAudio.pause();
    }, 2000);
  };

  const handleSave = () => {
    let finalH = inputH;
    let finalM = inputM;
    
    if (!use24Hour) {
      if (inputAmPm === 'PM' && finalH !== 12) finalH += 12;
      if (inputAmPm === 'AM' && finalH === 12) finalH = 0;
    }
    
    if (finalH < 0) finalH = 0;
    if (finalH > 23) finalH = 23;
    if (finalM < 0) finalM = 0;
    if (finalM > 59) finalM = 59;
    
    if (editingId) {
      // If editing, we actually need an edit function in useAlarm, or we can just delete and add?
      // Wait, delete and add changes the ID and order.
      // Let's implement edit by deleting and adding for now, or just leave it.
      // Actually, standard useAlarm doesn't have edit. I'll just use delete then add.
      deleteAlarm(editingId);
    }
    
    addAlarm(finalH, finalM);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingId) {
      deleteAlarm(editingId);
      setIsModalOpen(false);
    }
  };


  const pad = (num: number) => num.toString().padStart(2, '0');

  const formatTime = (h: number, m: number) => {
    let displayH = h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (!use24Hour) {
      displayH = h % 12 || 12;
    }
    return { timeStr: `${displayH}:${pad(m)}`, ampm: use24Hour ? '' : ampm };
  };

  return (
    <div className="alarm-container">
      <div className="alarm-list">
        {alarms.length === 0 && (
          <div className="empty-state">No alarms set</div>
        )}

        {alarms.map(alarm => {
          const { timeStr, ampm } = formatTime(alarm.hours, alarm.minutes);
          return (
            <div key={alarm.id} className="alarm-card" onClick={() => openEditModal(alarm)}>
              <div className="alarm-info">
                <div className={`alarm-time ${!alarm.isEnabled ? 'disabled' : ''}`}>
                  {timeStr} <span className="ampm">{ampm}</span>
                </div>
                <div className="alarm-subtitle">
                  {alarm.snoozeUntil ? 'Snoozed' : 'Ring once'}
                </div>
              </div>
              <div className="alarm-actions" onClick={e => e.stopPropagation()}>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={alarm.isEnabled} 
                    onChange={(e) => toggleAlarm(alarm.id, e.target.checked)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button className="fab-add" onClick={openAddModal}>
        <Plus size={32} color="#fff" />
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content add-alarm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Alarm' : 'Add Alarm'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="time-picker">
              <div className="input-group">
                <input 
                  type="number" 
                  min={use24Hour ? "0" : "1"} 
                  max={use24Hour ? "23" : "12"} 
                  value={inputH} 
                  onChange={e => setInputH(Number(e.target.value))} 
                />
              </div>
              <div className="colon">:</div>
              <div className="input-group">
                <input 
                  type="number" 
                  min="0" max="59" 
                  value={inputM} 
                  onChange={e => setInputM(Number(e.target.value))} 
                />
              </div>
              
              {!use24Hour && (
                <div className="ampm-toggle">
                  <button 
                    className={`ampm-btn ${inputAmPm === 'AM' ? 'active' : ''}`}
                    onClick={() => setInputAmPm('AM')}
                  >AM</button>
                  <button 
                    className={`ampm-btn ${inputAmPm === 'PM' ? 'active' : ''}`}
                    onClick={() => setInputAmPm('PM')}
                  >PM</button>
                </div>
              )}
            </div>
            <div className="modal-actions" style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                {editingId && (
                  <button className="btn btn-outline delete-btn" onClick={handleDelete} style={{ flex: 1 }}>
                    Delete
                  </button>
                )}
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave}>
                  Save
                </button>
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleTestSound}>
                Test Sound
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
