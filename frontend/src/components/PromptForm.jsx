import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PromptForm = ({ mode, onGenerate, loading, promptHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const modeConfig = {
    image: {
      title: 'Describe your image',
      description: 'Be specific — colors, style, mood, lighting all help',
      buttonLabel: 'Generate Image',
      placeholder: 'e.g. A lone astronaut standing on Mars at golden hour, cinematic lighting, ultra realistic...',
      examples: [
        'A serene Japanese garden with cherry blossoms at dusk',
        'Futuristic city skyline with neon lights and flying cars',
        'A magical forest with glowing bioluminescent trees',
        'Steampunk airship sailing through stormy clouds',
      ],
      negativePromptDefault: '',
    },
    logo: {
      title: 'Describe your logo',
      description: 'Include brand name, style, colors, and industry',
      buttonLabel: 'Generate Logo',
      placeholder: 'e.g. Minimalist tech startup logo, geometric shape, dark blue and silver...',
      examples: [
        'Minimal tech company logo, geometric, electric blue',
        'Law firm logo, classic serif, gold and black',
        'Gaming brand logo, aggressive, neon green and dark',
        'Eco startup logo, leaf motif, earthy greens',
      ],
      negativePromptDefault: 'blurry, messy, photo, realistic, background clutter, text, watermark',
    },
  };

  const config = modeConfig[mode];

  useEffect(() => {
    setPrompt('');
    setCharCount(0);
    setNegativePrompt(mode === 'logo' ? modeConfig.logo.negativePromptDefault : '');
    setShowNegative(mode === 'logo');
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(prompt, negativePrompt);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '6px',
          letterSpacing: '-0.01em',
        }}>
          {config.title}
        </h2>
        <p style={{ color: 'rgba(100,116,139,0.9)', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {config.description}
        </p>
      </div>

      {/* Prompt textarea */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label className="label">Prompt</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={handlePromptChange}
          placeholder={config.placeholder}
          rows="4"
          maxLength={500}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          fontSize: '0.7rem',
          color: charCount > 400 ? '#f87171' : 'rgba(100,116,139,0.5)',
          fontWeight: 500,
        }}>
          {charCount}/500
        </div>
      </div>

      {/* Quick examples */}
      <div style={{ marginBottom: '24px' }}>
        <label className="label">Quick Examples</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {config.examples.map((example, idx) => (
            <motion.button
              key={idx}
              type="button"
              id={`example-${idx}`}
              onClick={() => { setPrompt(example); setCharCount(example.length); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="chip"
              disabled={loading}
            >
              💡 {example.length > 35 ? example.substring(0, 35) + '…' : example}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider" style={{ marginBottom: '20px' }} />

      {/* Negative Prompt */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <input
            type="checkbox"
            id="negativePromptToggle"
            checked={showNegative}
            onChange={(e) => setShowNegative(e.target.checked)}
          />
          <label htmlFor="negativePromptToggle" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'rgba(203,213,225,0.8)',
            cursor: 'pointer',
            userSelect: 'none',
          }}>
            Negative Prompt
            <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'rgba(100,116,139,0.6)', fontWeight: 400 }}>
              — what to exclude
            </span>
          </label>
        </div>

        <AnimatePresence>
          {showNegative && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <textarea
                id="negative-prompt-input"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, distorted, watermark..."
                rows="2"
                disabled={loading}
                style={{ fontSize: '0.85rem', opacity: loading ? 0.6 : 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generate Button */}
      <motion.button
        type="submit"
        id="generate-btn"
        disabled={loading || !prompt.trim()}
        whileHover={!loading && prompt.trim() ? { scale: 1.02 } : {}}
        whileTap={!loading && prompt.trim() ? { scale: 0.98 } : {}}
        className="btn-generate"
        style={{ opacity: !prompt.trim() ? 0.4 : 1 }}
      >
        {loading ? (
          <>
            <span className="loader-sm" />
            <span>Generating…</span>
          </>
        ) : (
          <>
            <span>✦</span>
            <span>{config.buttonLabel}</span>
          </>
        )}
      </motion.button>

      {/* Recent Prompts */}
      <AnimatePresence>
        {promptHistory.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '28px' }}
          >
            <div className="divider" style={{ marginBottom: '16px' }} />
            <label className="label">Recent Prompts</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {promptHistory.map((p, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  onClick={() => { setPrompt(p); setCharCount(p.length); }}
                  whileHover={{ x: 4 }}
                  className="glass-sm"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: 'rgba(148,163,184,0.7)',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ marginRight: '8px', opacity: 0.5 }}>↺</span>
                  {p.substring(0, 70)}{p.length > 70 ? '…' : ''}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default PromptForm;
