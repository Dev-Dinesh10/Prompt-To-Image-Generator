import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PromptForm = ({ mode, onGenerate, loading, promptHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);

  const modeConfig = {
    image: {
      title: 'General Image Generator',
      description: 'Describe any image you want to create',
      buttonLabel: 'Generate Image',
      placeholder: 'e.g., A futuristic city in neon lights, cyberpunk style...',
      examples: [
        'A serene Japanese garden with cherry blossoms',
        'A futuristic space station orbiting a blue planet',
        'A magical forest with bioluminescent trees',
        'A steampunk airship in the clouds',
      ],
      negativePromptDefault: '',
    },
    logo: {
      title: 'Professional Logo Generator',
      description: 'Create clean, modern brand logos',
      buttonLabel: 'Generate Logo',
      placeholder: 'e.g., Tech startup, minimalist, modern...',
      examples: [
        'Minimalist tech company logo, geometric, modern',
        'Professional consulting firm logo, clean lines, vector style',
        'Startup logo, flat design, brand identity',
        'E-commerce brand logo, simple geometric shapes',
      ],
      negativePromptDefault: 'blurry, messy, photo, realistic humans, background clutter, text, watermark',
    },
  };

  const config = modeConfig[mode];

  useEffect(() => {
    setPrompt('');
    setNegativePrompt(
      mode === 'logo'
        ? modeConfig.logo.negativePromptDefault
        : modeConfig.image.negativePromptDefault
    );
    setShowNegative(mode === 'logo');
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(prompt, negativePrompt);
  };

  const insertExample = (example) => {
    setPrompt(example);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
        <p className="text-gray-400 text-sm">{config.description}</p>
      </div>

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-200">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={config.placeholder}
          rows="4"
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Quick Examples */}
      <div>
        <label className="block text-xs font-semibold mb-3 text-gray-400 uppercase tracking-wide">
          Quick Examples
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.examples.map((example, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => insertExample(example)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 glass-sm hover:bg-white/15 text-left text-xs text-gray-300 rounded-lg transition-all"
            >
              💡 {example.substring(0, 40)}...
            </motion.button>
          ))}
        </div>
      </div>

      {/* Negative Prompt Toggle & Input */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="negativePrompt"
            checked={showNegative}
            onChange={(e) => setShowNegative(e.target.checked)}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
          <label htmlFor="negativePrompt" className="text-sm font-semibold text-gray-200 cursor-pointer">
            Negative Prompt (Optional)
          </label>
        </div>

        {showNegative && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid in the image..."
              rows="2"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
            {mode === 'logo' && (
              <p className="text-xs text-gray-400 mt-2">
                ℹ️ For logos, negative prompt is auto-set to exclude common unwanted elements
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Generate Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`w-full py-3 px-6 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          loading
            ? 'bg-blue-500/50 cursor-not-allowed opacity-75'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-hover'
        }`}
      >
        {loading ? (
          <>
            <div className="loader w-5 h-5 border-2"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>{config.buttonLabel}</span>
          </>
        )}
      </motion.button>

      {/* Prompt History */}
      {promptHistory.length > 0 && (
        <div>
          <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-wide">
            Recent Prompts
          </label>
          <div className="space-y-1">
            {promptHistory.map((p, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => setPrompt(p)}
                className="w-full p-2 text-left text-xs glass-sm hover:bg-white/10 rounded-lg text-gray-300 transition-all truncate"
                whileHover={{ x: 4 }}
              >
                🕐 {p.substring(0, 60)}...
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default PromptForm;
