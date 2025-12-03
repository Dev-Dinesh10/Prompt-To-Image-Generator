import React from 'react';
import { motion } from 'framer-motion';

const ImagePreview = ({ image, mode, onDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-8 space-y-6"
    >
      {/* Image Container */}
      <div className="glass-sm p-6 flex justify-center">
        <motion.img
          src={image}
          alt="Generated"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-full max-h-96 rounded-lg shadow-2xl shadow-blue-500/20"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={onDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold rounded-lg transition-all glow-hover flex items-center justify-center gap-2"
        >
          <span>⬇️</span>
          <span>Download {mode === 'logo' ? 'Logo' : 'Image'}</span>
        </motion.button>

        <motion.button
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) textarea.focus();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 font-bold rounded-lg transition-all glow flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>Generate Another</span>
        </motion.button>
      </div>

      {/* Mode Info */}
      <div className="p-4 glass-sm text-sm text-gray-400">
        <p>
          {mode === 'logo'
            ? '✨ Logo generated with emphasis on clean lines, minimalist design, and brand identity.'
            : '🎨 Image generated using advanced AI model from Hugging Face.'}
        </p>
      </div>
    </motion.div>
  );
};

export default ImagePreview;
