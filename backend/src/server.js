import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateWithClipdrop } from './providers/clipdrop.js';
import {
  generateWithHuggingFace,
  imageToImageHuggingFace,
  removeBackgroundHuggingFace,
  upscaleImageHuggingFace,
} from './providers/huggingface.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─── Health Check ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Image & Logo Generator API' });
});

// ─── TEXT TO IMAGE ─────────────────────────────────────────────────
// Modes: image, logo, anime, interior, product,
//        fashion, nature, portrait, fantasy, food, 3d
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, negativePrompt, mode } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required and must be a non-empty string',
      });
    }

    const validModes = [
      'image', 'logo', 'anime', 'interior', 'product',
      'fashion', 'nature', 'portrait', 'fantasy', 'food', '3d',
    ];

    if (!mode || !validModes.includes(mode)) {
      return res.status(400).json({
        error: `Mode must be one of: ${validModes.join(', ')}`,
      });
    }

    const cleanPrompt = prompt.trim().substring(0, 500);
    const cleanNegativePrompt = negativePrompt?.trim().substring(0, 500) || '';

    console.log(`[API] Generating ${mode} with prompt: "${cleanPrompt}"`);

    const provider = process.env.PROVIDER || 'huggingface';
    let result;

    if (provider === 'clipdrop') {
      result = await generateWithClipdrop(cleanPrompt, cleanNegativePrompt, mode);
    } else if (provider === 'huggingface') {
      result = await generateWithHuggingFace(cleanPrompt, cleanNegativePrompt, mode);
    } else {
      return res.status(400).json({
        error: `Unknown provider: ${provider}. Use "clipdrop" or "huggingface".`,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('[API Error]', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// ─── IMAGE TO IMAGE ────────────────────────────────────────────────
app.post('/api/img2img', async (req, res) => {
  try {
    const { prompt, image, strength } = req.body;

    if (!prompt || !image) {
      return res.status(400).json({ error: 'Prompt and image are required.' });
    }

    console.log(`[API] Image-to-Image | Prompt: "${prompt.trim().substring(0, 100)}"`);

    const result = await imageToImageHuggingFace(
      prompt.trim().substring(0, 500),
      image,
      strength || 0.75
    );

    res.json(result);
  } catch (error) {
    console.error('[Img2Img Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── BACKGROUND REMOVAL ───────────────────────────────────────────
app.post('/api/remove-background', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    console.log(`[API] Background Removal requested`);

    const result = await removeBackgroundHuggingFace(image);
    res.json(result);
  } catch (error) {
    console.error('[BG Removal Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── IMAGE UPSCALING ──────────────────────────────────────────────
app.post('/api/upscale', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    console.log(`[API] Image Upscaling requested`);

    const result = await upscaleImageHuggingFace(image);
    res.json(result);
  } catch (error) {
    console.error('[Upscale Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── 404 Handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET  /health',
      'POST /api/generate',
      'POST /api/img2img',
      'POST /api/remove-background',
      'POST /api/upscale',
    ],
  });
});

// ─── Error Handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  AI Image & Logo Generator API         ║
║  Server running on port ${PORT}           ║
╚════════════════════════════════════════╝

📝 Provider : ${process.env.PROVIDER || 'huggingface'}
🔗 HF Key   : ${process.env.HUGGINGFACE_API_KEY ? '✓ Set' : '✗ Missing'}
🔗 CD Key   : ${process.env.CLIPDROP_API_KEY ? '✓ Set' : '✗ Missing'}

Available endpoints:
  GET  /health
  POST /api/generate        ← Text to Image (11 modes)
  POST /api/img2img         ← Image to Image
  POST /api/remove-background ← Background Removal
  POST /api/upscale         ← Image Upscaling (4x)

Frontend: http://localhost:5173
  `);
});