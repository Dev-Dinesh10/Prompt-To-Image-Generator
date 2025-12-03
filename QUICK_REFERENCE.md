# ⚡ Quick Reference Card

**AI Image & Logo Generator** - Quick command reference

---

## 🚀 Getting Started (60 seconds)

```bash
# 1. Setup (run once)
setup.bat                    # Windows
# or
./setup.sh                   # Mac/Linux

# 2. Configure API key
# Edit: backend/.env
# Add your Hugging Face API key from:
# https://huggingface.co/settings/tokens

# 3. Start development
npm run dev

# 4. Open in browser
http://localhost:5173
```

---

## 📝 Common Commands

### Development
```bash
npm run dev              # Start both frontend & backend
npm run frontend         # Frontend only (localhost:5173)
npm run backend          # Backend only (localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Installation
```bash
npm run install-all      # Install all dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Git
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx    # Required!
HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
PROVIDER=huggingface
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000     # Local dev
```

### Production Frontend
```env
VITE_API_URL=https://your-api-domain.com
```

---

## 🎯 Project Structure

```
frontend/          ← React app (port 5173)
├── src/
│   ├── App.jsx                    # Main component
│   ├── components/
│   │   ├── ModeSelector.jsx       # Toggle modes
│   │   ├── PromptForm.jsx         # Input form
│   │   └── ImagePreview.jsx       # Display image
│   └── index.css                  # Styling
└── vite.config.js

backend/           ← Express API (port 3000)
├── src/
│   ├── server.js                  # API server
│   └── providers/
│       ├── huggingface.js         # AI provider
│       └── gemini.js              # Template
└── .env                           # API keys
```

---

## 🌐 API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Generate image/logo
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city",
    "negativePrompt": "blurry",
    "mode": "image"
  }'
```

---

## 🎨 Two Modes

### Image Mode 🎨
- Any artistic content
- Flexible sizes
- Normal prompts

```javascript
{
  "prompt": "A futuristic city in neon lights",
  "mode": "image"
}
```

### Logo Mode ✨
- Professional logos
- 512×512 size
- Auto-enhanced prompts

```javascript
{
  "prompt": "Tech startup logo",
  "mode": "logo"
}
```

---

## 📚 Documentation Quick Links

| Need | File |
|------|------|
| Overview | README.md |
| Setup | SETUP.md |
| API Docs | API.md |
| Features | FEATURES.md |
| Deploy | DEPLOYMENT.md |
| Help! | TROUBLESHOOTING.md |
| Details | PROJECT_SUMMARY.md |

---

## 🔧 Configuration Quick Reference

### Change AI Model
Edit `backend/.env`:
```env
HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0  # Best quality
HUGGINGFACE_MODEL=FLUX.1-schnell                 # Fastest
HUGGINGFACE_MODEL=runwayml/stable-diffusion-v1-5 # Classic
```

### Change Frontend Port
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 5174  // Change from 5173
}
```

### Change Backend Port
Edit `backend/.env`:
```env
PORT=3001  // Change from 3000
```

---

## ⚡ Performance Tips

| Tip | Impact |
|-----|--------|
| Use FLUX.1-schnell | 5-10s (vs 15-30s) |
| Cache images locally | Faster reuse |
| Clear browser cache | Fix display issues |
| Use production build | Better performance |
| Deploy to CDN | Faster delivery |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not set" | Add to backend/.env |
| "Port in use" | Change PORT in .env |
| "503 error" | Wait 30-60s (model loading) |
| "Images not showing" | Check VITE_API_URL |
| "npm: not found" | Install Node.js |
| "CORS error" | Verify API URL in .env |

---

## 🚀 Deployment Quick Start

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
1. Push to GitHub
2. Connect repo in Render dashboard
3. Set environment variables
4. Deploy

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640-1024px
- **Desktop**: > 1024px

---

## 🎬 Animation Controls

Configured in:
- `frontend/src/index.css` - Custom animations
- Component files - Framer Motion animations

---

## 🔐 Security Checklist

- [ ] Use strong API key
- [ ] Don't commit .env files
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Enable CORS restrictions
- [ ] Set secure headers

---

## 📊 File Size Reference

| Item | Size |
|------|------|
| Frontend bundle | ~150KB (gzipped) |
| Per generated image | 20-200KB |
| Backend code | ~500 lines |
| Frontend code | ~1,500 lines |

---

## 🎓 Tech Stack Summary

**Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
**Backend**: Express.js + Node.js
**AI**: Hugging Face Inference API (free tier)
**Styling**: TailwindCSS + CSS animations
**State**: React hooks + localStorage

---

## 🔄 Development Workflow

```
1. Edit code (frontend/src or backend/src)
2. Save file (hot reload automatic)
3. Test in browser (http://localhost:5173)
4. Check backend logs (npm run backend terminal)
5. Commit changes (git add, git commit)
6. Push to GitHub (git push)
7. Deploy (Vercel/Render auto-deploy)
```

---

## 📞 Getting Help

1. **Check docs**: README.md → SETUP.md → TROUBLESHOOTING.md
2. **Read errors**: Check browser console (F12) & terminal
3. **Search docs**: Use Ctrl+F in .md files
4. **Test API**: Use curl or Postman to test endpoints

---

## ✨ Key Features At a Glance

✅ Dark glassmorphism UI
✅ Two generation modes
✅ Free AI models (Hugging Face)
✅ Prompt history (localStorage)
✅ Download images
✅ Mobile responsive
✅ Production ready
✅ Fully documented

---

## 🎯 Next Steps

1. [ ] Run setup.bat/setup.sh
2. [ ] Get HuggingFace API key
3. [ ] Add key to backend/.env
4. [ ] Run npm run dev
5. [ ] Test in browser
6. [ ] Deploy to production

---

## 💡 Pro Tips

- Use **FLUX.1-schnell** for speed
- Try **different prompts** for variety
- Check **prompt history** for inspiration
- Deploy to **Vercel + Render** (free tier)
- Customize **TailwindCSS colors** for branding
- Add **error logging** (Sentry) in production

---

## 📋 Checklist Before Deployment

- [ ] API key configured
- [ ] Frontend built (`npm run build`)
- [ ] Backend tested with health check
- [ ] Environment variables set on platform
- [ ] CORS configured correctly
- [ ] Error logging setup
- [ ] Documentation reviewed

---

**Start with `npm run dev` → Open http://localhost:5173** 🚀

For details, see full documentation in .md files!
