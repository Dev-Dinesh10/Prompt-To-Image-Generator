# 🎨 AI Image & Logo Generator

A production-ready full-stack web application for generating AI images and professional logos using **Hugging Face's free inference API**.

**Live Demo Modes:**
1. 🎨 **General Image Generator** - Create artistic images with detailed prompts
2. ✨ **Professional Logo Generator** - Design clean, minimal brand logos

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- Free Hugging Face API key (https://huggingface.co/settings/tokens)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your Hugging Face API key
npm start
```

Server runs at: `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App opens at: `http://localhost:5173`

## 📋 Features

### Frontend 🎯
- ⚡ **Vite + React 18** for fast development
- 🎨 **Dark Glassmorphism UI** with gradient animations
- 🔄 **Mode Switcher** - Toggle between Image & Logo generation
- 📝 **Smart Prompt Input** - Mode-specific examples and suggestions
- 💾 **Prompt History** - Last 5 prompts saved per mode
- 📱 **Fully Responsive** - Desktop, tablet, mobile
- ✨ **Smooth Animations** - Framer Motion transitions
- 🎬 **Live Image Preview** - Base64 image rendering
- ⬇️ **Download Feature** - Save generated images locally

### Backend 🔧
- ⚡ **Express.js Server** - ES modules, CORS enabled
- 🤖 **Hugging Face Integration** - Free inference API
- 🎯 **Dual Providers** - Hugging Face (active) + Gemini (commented template)
- 🧠 **Smart Mode Logic** - Automatic negative prompt injection for logos
- 🔒 **Input Validation** - Sanitization & length limits
- 📊 **Error Handling** - Detailed error messages

## 🔌 API Reference

### Health Check
```bash
GET /health
```

### Generate Image/Logo
```bash
POST /api/generate

Request:
{
  "prompt": "A beautiful sunset",
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

## 🎯 Mode Behaviors

### General Image Mode
- **Size**: Flexible (512x512 - 1024x1024)
- **Style**: Artistic, detailed, varied styles
- **Prompts**: Natural language descriptions
- **Examples**:
  - "A serene Japanese garden with cherry blossoms"
  - "A futuristic space station orbiting a blue planet"
  - "A magical forest with bioluminescent trees"

### Logo Design Mode
- **Size**: 512x512 (square, perfect for logos)
- **Style**: Minimal, clean, vector-style
- **Prompts**: Brand-focused, geometric, professional
- **Auto Negatives**: Removes blur, realistic elements, clutter
- **Examples**:
  - "Tech startup logo, minimalist, modern"
  - "Professional consulting firm logo, clean lines, vector style"
  - "E-commerce brand logo, simple geometric shapes"

## 🤖 Available AI Models

All free from Hugging Face:

| Model | Generation Time | Quality | Best For |
|-------|-----------------|---------|----------|
| `stable-diffusion-xl-base-1.0` | ~15-30s | High | Default, best quality |
| `FLUX.1-schnell` | ~5-10s | Very High | Fast generation |
| `runwayml/stable-diffusion-v1-5` | ~10-20s | Good | Reliable classic |

Change model in backend `.env` file:
```env
HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
```

## 🔐 Authentication

Get your free Hugging Face API key:

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Select "Read" permissions
4. Copy token
5. Paste in backend `.env`:
   ```
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
   ```

## 📁 Project Structure

```
Prompt-To-Image-Generator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModeSelector.jsx      # Toggle image/logo mode
│   │   │   ├── PromptForm.jsx        # Prompt input & examples
│   │   │   └── ImagePreview.jsx      # Display & download
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # TailwindCSS + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── providers/
│   │   │   ├── huggingface.js        # Hugging Face provider (active)
│   │   │   └── gemini.js             # Gemini provider (commented template)
│   │   └── server.js                 # Express server & routes
│   ├── .env.example
│   ├── .env
│   └── package.json
│
└── README.md (this file)
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Framer Motion (animations)
- Axios (HTTP client)

**Backend:**
- Node.js / Express.js
- Hugging Face Inference API
- CORS (cross-origin requests)
- dotenv (environment config)

## 🔌 Optional: Gemini Provider

The backend includes a **commented-out template** for Google Gemini:

Located in `backend/src/providers/gemini.js`

To activate:
1. Set up Google Cloud credentials
2. Update `.env`: `PROVIDER=gemini`
3. Uncomment the code and follow instructions
4. Add your Google Cloud API keys

**Current production build uses only free Hugging Face models** ✅

## ⚡ Performance Tips

1. **First request slower**: Models load on-demand (free tier)
2. **Caching**: Browser caches generated images (localStorage)
3. **Model size**: Choose `FLUX.1-schnell` for faster generations
4. **Batch requests**: Wait for one to complete before next

## 🐛 Troubleshooting

### "503 Service Unavailable"
- Model is loading (first time or after idle)
- Wait 30-60 seconds and retry
- Free tier models may need warmup

### "Invalid API Key"
- Check token is valid: https://huggingface.co/settings/tokens
- Token needs "Read" permissions
- Restart backend after changing `.env`

### CORS Errors
- Make sure `VITE_API_URL` in frontend `.env` matches backend port
- Default: `http://localhost:3000`
- Check backend is running

### Images not displaying
- Ensure valid base64 conversion
- Check browser console for errors
- Try refreshing page

## 📜 License

MIT License - Feel free to use in your projects!

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway/Heroku)
```bash
cd backend
npm install
# Set environment variables on platform
npm start
```

## 💡 Future Enhancements

- [ ] User authentication & history
- [ ] Image editing/refinement tools
- [ ] Batch generation
- [ ] Custom model support
- [ ] Image upscaling
- [ ] Advanced filters & effects
- [ ] Social sharing
- [ ] Rate limiting

---

**Made with ❤️ using free AI models**
