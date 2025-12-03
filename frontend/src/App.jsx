import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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

  // Load prompt history from localStorage
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
      console.error('Generation error:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 gradient-text">
            AI Image & Logo Generator
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Create stunning visuals powered by Hugging Face
          </p>
        </div>

        {/* Mode Selector */}
        <ModeSelector mode={mode} onModeChange={handleModeChange} />

        {/* Main Container */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass mt-8 p-6 sm:p-8"
        >
          <PromptForm
            mode={mode}
            onGenerate={handleGenerate}
            loading={loading}
            promptHistory={promptHistory}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="loader"></div>
            </div>
          )}

          {image && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ImagePreview image={image} mode={mode} onDownload={handleDownload} />
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-xs sm:text-sm">
          <p>Powered by Clipdrop • Free & Open Source</p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
