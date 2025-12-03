import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateWithClipdrop } from './providers/clipdrop.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Image & Logo Generator API' });
});

/**
 * POST /api/generate
 * Generate an image or logo
 *
 * Request body:
 * {
 *   "prompt": "A beautiful sunset over mountains",
 *   "negativePrompt": "blurry, low quality",
 *   "mode": "image" | "logo"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "image": "data:image/png;base64,...",
 *   "model": "stable-diffusion-xl-base-1.0",
 *   "provider": "huggingface"
 * }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, negativePrompt, mode } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required and must be a non-empty string',
      });
    }

    if (!mode || !['image', 'logo'].includes(mode)) {
      return res.status(400).json({
        error: 'Mode must be either "image" or "logo"',
      });
    }

    // Sanitize inputs
    const cleanPrompt = prompt.trim().substring(0, 500);
    const cleanNegativePrompt = negativePrompt
      ? negativePrompt.trim().substring(0, 500)
      : '';

    console.log(`[API] Generating ${mode} with prompt: "${cleanPrompt}"`);

    // Get provider from environment (default: clipdrop)
    const provider = process.env.PROVIDER || 'clipdrop';

    let result;

    if (provider === 'clipdrop') {
      result = await generateWithClipdrop(cleanPrompt, cleanNegativePrompt, mode);
    } else if (provider === 'huggingface') {
      result = await generateWithHuggingFace(cleanPrompt, cleanNegativePrompt, mode);
    } else if (provider === 'gemini') {
      result = await generateWithGemini(cleanPrompt, cleanNegativePrompt, mode);
    } else {
      return res.status(400).json({
        error: `Unknown provider: ${provider}. Use "clipdrop", "huggingface", or "gemini".`,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('[API Error]', error.message);

    res.status(500).json({
      error: error.message || 'Failed to generate image',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/generate',
    ],
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  AI Image & Logo Generator API         ║
║  Server running on port ${PORT}           ║
╚════════════════════════════════════════╝

📝 Provider: ${process.env.PROVIDER || 'clipdrop'}
🎨 Service: Clipdrop (Stability AI)
🔗 API Key: ${process.env.CLIPDROP_API_KEY ? '✓ Set' : '✗ Missing'}

Available endpoints:
  GET  /health
  POST /api/generate

Frontend: http://localhost:5173
  `);
});
