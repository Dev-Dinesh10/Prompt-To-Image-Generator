import React from 'react';
import { motion } from 'framer-motion';

const ImagePreview = ({ image, mode, onDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ marginTop: '36px' }}
    >
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#7c3aed',
            boxShadow: '0 0 8px rgba(124,58,237,0.8)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(167,139,250,0.9)', letterSpacing: '0.05em' }}>
            GENERATED {mode === 'logo' ? 'LOGO' : 'IMAGE'}
          </span>
        </div>
        <span className="badge">✓ Ready</span>
      </div>

      {/* Image Container */}
      <div className="image-frame" style={{ marginBottom: '20px' }}>
        <motion.img
          src={image}
          alt={`Generated ${mode}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '16px',
          }}
        />
      </div>

      {/* Info strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <span className="badge">
          🤖 {mode === 'logo' ? 'Clipdrop AI' : 'FLUX.1-schnell'}
        </span>
        <span className="badge">
          📐 1024 × 1024
        </span>
        <span className="badge">
          🎨 {mode === 'logo' ? 'Logo Mode' : 'Image Mode'}
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <motion.button
          id="download-btn"
          onClick={onDownload}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-download"
          style={{ flex: 1 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download {mode === 'logo' ? 'Logo' : 'Image'}
        </motion.button>

        <motion.button
          id="generate-another-btn"
          onClick={() => {
            const textarea = document.getElementById('prompt-input');
            if (textarea) { textarea.focus(); textarea.select(); }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-secondary"
          style={{ flex: 1 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.96" />
          </svg>
          Generate Another
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ImagePreview;
