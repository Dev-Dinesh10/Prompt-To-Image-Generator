import React from 'react';
import { motion } from 'framer-motion';

const ModeSelector = ({ mode, onModeChange }) => {
  const modes = [
    {
      id: 'image',
      label: 'General Image',
      icon: '🎨',
      description: 'Create artistic images',
    },
    {
      id: 'logo',
      label: 'Logo Design',
      icon: '✨',
      description: 'Design professional logos',
    },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {modes.map((m) => (
        <motion.button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            mode === m.id
              ? 'glass glow bg-blue-500/20 border-blue-400/50 text-white'
              : 'glass-sm hover:bg-white/10 text-gray-300'
          }`}
        >
          <span className="text-xl">{m.icon}</span>
          <div className="text-left">
            <div className="text-sm font-bold">{m.label}</div>
            <div className="text-xs opacity-70">{m.description}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ModeSelector;
