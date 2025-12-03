# Backend - AI Image & Logo Generator API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Get a **free Hugging Face API key**:
   - Go to: https://huggingface.co/settings/tokens
   - Create a new token with read access
   - Add it to `.env`: `HUGGINGFACE_API_KEY=your_key_here`

4. Start the server:
```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

Server will run on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

### Generate Image/Logo
```
POST /api/generate

Request body:
{
  "prompt": "A futuristic city",
  "negativePrompt": "blurry, low quality",
  "mode": "image" | "logo"
}

Response:
{
  "success": true,
  "image": "data:image/png;base64,...",
  "model": "stable-diffusion-xl-base-1.0",
  "provider": "huggingface"
}
```

## Models

Free models available on Hugging Face:

| Model | Best For | Size |
|-------|----------|------|
| `stable-diffusion-xl-base-1.0` | High-quality images | Good quality |
| `FLUX.1-schnell` | Fast generation | Very fast |
| `runwayml/stable-diffusion-v1-5` | Classic style | Good quality |

## Troubleshooting

**503 Error: Model Loading**
- Free tier models on Hugging Face may take time to initialize
- Just wait a moment and try again
- The first request will be slower as the model loads

**Invalid API Key**
- Make sure your token is valid and has read access
- Check `.env` file has the correct key

**CORS Errors**
- Make sure frontend and backend are on correct ports
- Check `VITE_API_URL` in frontend `.env`

## Optional: Gemini Provider

To add Google Gemini support (commented out by default):

1. Set up Google Cloud credentials
2. Update `.env` with `PROVIDER=gemini`
3. Uncomment code in `src/providers/gemini.js`
4. Follow instructions in that file

Current implementation only uses **free Hugging Face models**.
