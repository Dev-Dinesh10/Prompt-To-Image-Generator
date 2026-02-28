import React from 'react';
import { motion } from 'framer-motion';

const ModeSelector = ({ mode, onModeChange }) => {
  const modes = [
    {
      id: 'image',
      label: 'Image Generation',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      description: 'Photorealistic & artistic images',
    },
    {
      id: 'logo',
      label: 'Logo Design',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      description: 'Clean minimalist brand logos',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '6px',
    }}>
      {modes.map((m) => (
        <motion.button
          key={m.id}
          id={`mode-${m.id}`}
          onClick={() => onModeChange(m.id)}
          whileTap={{ scale: 0.97 }}
          className={`mode-tab ${mode === m.id ? 'active' : ''}`}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <span style={{ opacity: mode === m.id ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            {m.icon}
          </span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>{m.label}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.55, fontWeight: 400, marginTop: '1px' }}>{m.description}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ModeSelector;
