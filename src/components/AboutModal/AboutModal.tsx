import React from 'react';
import { X } from 'lucide-react';
import '../OptionsModal/OptionsModal.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Premium Flip Clock</h1>
          <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
            A modern digital clock and countdown experience. <br/>
            Designed for focus and aesthetic.
          </p>
        </div>
      </div>
    </div>
  );
};
