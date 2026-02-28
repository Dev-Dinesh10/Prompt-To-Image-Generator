import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ModeSelector from './components/ModeSelector';
import PromptForm from './components/PromptForm';
import ImagePreview from './components/ImagePreview';
import './index.css';

function App() {
  const [mode, setMode] = useState('image');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const saved = localStorage.getItem(`promptHistory_${mode}`);
    if (saved) {
      setPromptHistory(JSON.parse(saved));
    } else {
      setPromptHistory([]);
    }
  }, [mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setImage(null);
    setError('');
  };

  const savePromptHistory = (prompt) => {
    const updated = [prompt, ...promptHistory.slice(0, 4)];
    setPromptHistory(updated);
    localStorage.setItem(`promptHistory_${mode}`, JSON.stringify(updated));
  };

  const handleGenerate = async (prompt, negativePrompt) => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setLoading(true);
    setError('');
    setImage(null);
    try {
      const response = await axios.post(`${API_URL}/api/generate`, {
        prompt,
        negativePrompt,
        mode,
      });
      setImage(response.data.image);
      savePromptHistory(prompt);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `${mode}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ── Ambient Orbs ─────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="animate-float" style={{
          position: 'absolute', top: '-5%', left: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div className="animate-float-delayed" style={{
          position: 'absolute', bottom: '-5%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
          >
            <span className="badge">⚡ Powered by FLUX.1 & Clipdrop</span>
          </motion.div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            <span className="gradient-text">AI Image</span>
            <br />
            <span style={{ color: '#f1f5f9' }}>Generator</span>
          </h1>

          <p style={{
            color: 'rgba(148, 163, 184, 0.7)',
            fontSize: '0.95rem',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '400px',
            margin: '0 auto',
          }}>
            Transform your words into stunning visuals using state-of-the-art AI models
          </p>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass"
          style={{ marginTop: '24px', padding: 'clamp(24px, 5vw, 40px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PromptForm
                mode={mode}
                onGenerate={handleGenerate}
                loading={loading}
                promptHistory={promptHistory}
              />
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="error-box"
                style={{ marginTop: '20px' }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div className="loader" />
                <p style={{ color: 'rgba(167, 139, 250, 0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
                  Creating your {mode === 'logo' ? 'logo' : 'image'}…
                </p>
                <p style={{ color: 'rgba(100,116,139,0.6)', fontSize: '0.75rem' }}>
                  This may take 10–30 seconds
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {image && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ImagePreview image={image} mode={mode} onDownload={handleDownload} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <p style={{ color: 'rgba(71,85,105,0.8)', fontSize: '0.75rem' }}>
            Free & Open Source · No watermarks · Unlimited generations
          </p>
        </motion.div>

      </div>
    </div>
  );
}

export default App;
