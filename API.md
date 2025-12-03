# 📚 API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All requests use API key authentication via environment variable `HUGGINGFACE_API_KEY`. This is handled server-side automatically.

---

## Endpoints

### 1. Health Check
Check if the API server is running.

**Request:**
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "service": "AI Image & Logo Generator API"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

### 2. Generate Image/Logo
Generate an AI image or logo based on a prompt.

**Request:**
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality, distorted",
  "mode": "image"
}
```

**Parameters:**

| Parameter | Type | Required | Description | Max Length |
|-----------|------|----------|-------------|-----------|
| `prompt` | string | ✅ Yes | Description of what to generate | 500 chars |
| `negativePrompt` | string | ❌ Optional | What to avoid in the image | 500 chars |
| `mode` | string | ✅ Yes | `"image"` or `"logo"` | - |

**Mode Behaviors:**

#### Image Mode (`"image"`)
- General artistic image generation
- Accepts any creative prompt
- No automatic negative prompts
- Uses user-provided negative prompt if available

```json
{
  "prompt": "A serene Japanese garden with cherry blossoms at sunset",
  "negativePrompt": "blurry, low quality",
  "mode": "image"
}
```

#### Logo Mode (`"logo"`)
- Professional logo generation
- Automatically enhances prompt with logo keywords
- Auto-applies negative prompt if not provided
- Optimized for 512x512 output

```json
{
  "prompt": "Tech startup company",
  "mode": "logo"
}
```

**Auto-applied for logo mode:**
- **Prompt enhancement**: Adds ", minimal, clean lines, vector style, flat logo, modern, simple brand identity, professional"
- **Default negative prompt**: "blurry, messy, photo, realistic humans, background clutter, text, watermark, complex"

**Response (200):**
```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "model": "stable-diffusion-xl-base-1.0",
  "provider": "huggingface"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `image` | string | Base64-encoded PNG image as data URL |
| `model` | string | The AI model used |
| `provider` | string | `"huggingface"` or `"gemini"` |

**Response Times:**
- First request: 30-60s (model initialization)
- Subsequent: 10-30s (depending on model)
- FLUX.1-schnell: 5-10s (fastest)

---

## Error Responses

### 400 - Bad Request
Missing or invalid parameters.

```json
{
  "error": "Prompt is required and must be a non-empty string"
}
```

```json
{
  "error": "Mode must be either \"image\" or \"logo\""
}
```

### 500 - Server Error
Server-side error or API failure.

```json
{
  "error": "Failed to generate image: Connection timeout"
}
```

### 503 - Service Unavailable
Hugging Face model is loading (free tier).

```json
{
  "error": "Model is loading. Please wait a moment and try again. Hugging Face free tier models may take time to initialize."
}
```

---

## Code Examples

### JavaScript / Axios

**Image Generation:**
```javascript
import axios from 'axios';

async function generateImage() {
  try {
    const response = await axios.post('http://localhost:3000/api/generate', {
      prompt: 'A cyberpunk neon city',
      negativePrompt: 'blurry, low quality',
      mode: 'image'
    });

    console.log(response.data.image); // data:image/png;base64,...
  } catch (error) {
    console.error('Error:', error.response.data.error);
  }
}
```

**Logo Generation:**
```javascript
async function generateLogo() {
  try {
    const response = await axios.post('http://localhost:3000/api/generate', {
      prompt: 'Professional tech consulting firm',
      mode: 'logo'
      // negativePrompt is optional - auto-applied for logos
    });

    console.log(response.data.image);
  } catch (error) {
    console.error('Error:', error.response.data.error);
  }
}
```

### Python / Requests

```python
import requests
import base64

def generate_image(prompt, mode='image', negative_prompt=''):
    url = 'http://localhost:3000/api/generate'
    
    payload = {
        'prompt': prompt,
        'negativePrompt': negative_prompt,
        'mode': mode
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        image_data = data['image'].split(',')[1]
        
        # Save image
        with open('generated.png', 'wb') as f:
            f.write(base64.b64decode(image_data))
        
        print(f"Image saved! Model: {data['model']}")
    else:
        print(f"Error: {response.json()['error']}")

# Usage
generate_image('A beautiful sunset', mode='image')
generate_image('Modern startup logo', mode='logo')
```

### cURL

```bash
# Image generation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city in neon lights",
    "negativePrompt": "blurry, low quality",
    "mode": "image"
  }'

# Logo generation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Tech startup company logo",
    "mode": "logo"
  }'

# Health check
curl http://localhost:3000/health
```

---

## Prompt Engineering Tips

### Image Mode Prompts
Best practices for general images:

✅ **Good Prompts:**
- "A serene Japanese garden with cherry blossoms, traditional architecture, peaceful atmosphere"
- "A futuristic space station, sci-fi, neon lights, cyberpunk aesthetic"
- "An oil painting of a stormy ocean, dramatic lighting, classical art style"

❌ **Avoid:**
- "good image" (too vague)
- "person" (may have restrictions)
- Super long prompts (keep under 200 chars for best results)

### Logo Mode Prompts
Tips for professional logos:

✅ **Good Prompts:**
- "Minimalist tech company logo, geometric shapes, modern, clean lines"
- "Professional consulting firm logo, lettermark, simple vector design"
- "E-commerce brand logo, abstract, flat design, modern"

❌ **Avoid:**
- Complex text or numbers
- Photorealistic styles
- Cluttered designs (negative prompt handles this)

### Negative Prompts Strategy
Tell the model what NOT to generate:

**General:**
```
blurry, low quality, distorted, watermark, text, artificial
```

**For Logos (Auto-applied):**
```
blurry, messy, photo, realistic humans, background clutter, text, watermark
```

**For Images with Specific Style:**
```
realistic, photograph, blurry, low quality, distorted
```

---

## Available Models

Change in `backend/.env`:

| Model | Speed | Quality | Config |
|-------|-------|---------|--------|
| **stable-diffusion-xl-base-1.0** | 15-30s | Very High | `HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0` |
| **FLUX.1-schnell** | 5-10s | High | `HUGGINGFACE_MODEL=FLUX.1-schnell` |
| **runwayml/stable-diffusion-v1-5** | 10-20s | Good | `HUGGINGFACE_MODEL=runwayml/stable-diffusion-v1-5` |

---

## Rate Limiting & Quotas

**Free Tier Limits (Hugging Face):**
- No strict rate limit per API call
- May experience wait time if model is loading
- First request initializes model (~30-60s)
- Subsequent requests faster (~10-30s)

**Recommendations:**
- Wait for response before making next request
- Don't spam requests in rapid succession
- Consider model warm-up time for production

---

## Deploying the API

### Render.com (Free)
```bash
# Push to GitHub
git push origin main

# Connect in Render dashboard
# Set environment variables:
# - HUGGINGFACE_API_KEY=your_key
# - HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
# - PROVIDER=huggingface
# - PORT=3000

# Start command: npm start
```

### Railway.app
```bash
# Login and connect GitHub repo
railway login
railway link

# Set environment variables in dashboard
# Deploy
railway up
```

### AWS Lambda + API Gateway
Requires restructuring to serverless format. See AWS Lambda documentation.

---

## WebSocket Support (Optional Future)

Currently uses REST. WebSocket support can be added for:
- Real-time generation progress
- Streaming responses
- Multiple concurrent requests

---

## CORS Configuration

The API accepts requests from any origin:
```javascript
app.use(cors()); // All origins allowed
```

For production, restrict CORS:
```javascript
const corsOptions = {
  origin: 'https://yourfrontend.com',
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Monitoring & Logging

Backend logs all requests to console:
```
[API] Generating image with prompt: "A beautiful sunset"
[HuggingFace] Generating image with prompt: "A beautiful sunset, minimal..."
```

Check logs in terminal where server is running.

---

## Troubleshooting API Issues

### "HUGGINGFACE_API_KEY is not set"
- Add key to `backend/.env`
- Restart server
- Verify token at https://huggingface.co/settings/tokens

### "Model is loading" (503)
- Wait 30-60 seconds
- Try request again
- Retry up to 3 times

### "Connection timeout"
- Backend may be down
- Check `http://localhost:3000/health`
- Check server logs

### Slow Responses
- First request slower (model init)
- Try FLUX.1-schnell for speed
- Check network connection
- Check Hugging Face status

---

## Future API Enhancements

- [ ] Image upscaling endpoint
- [ ] Image refinement/editing
- [ ] Batch generation
- [ ] WebSocket for progress tracking
- [ ] Rate limiting per IP
- [ ] Usage statistics
- [ ] Model selection endpoint

---

**Last Updated:** December 2025
