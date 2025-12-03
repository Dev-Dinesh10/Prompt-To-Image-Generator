# 🚀 Google Gemini API Setup (100% FREE)

## ⚡ Quick Setup (2 minutes)

### Step 1: Get Your Free API Key
1. Go to: **https://aistudio.google.com/app/apikeys**
2. Click **"Create API Key"**
3. Select **"Create new API key in new project"**
4. Copy your key

### Step 2: Add to .env
Edit `backend/src/.env`:
```env
GEMINI_API_KEY=your_copied_key_here
GEMINI_MODEL=gemini-2.0-flash
PROVIDER=gemini
```

### Step 3: Restart Backend
```bash
# In backend/src folder or root
npm run backend
```

### Step 4: Test
Go to http://localhost:5173 and generate an image! ✨

---

## 📊 Available Models

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| **gemini-2.0-flash** ⭐ | ⚡ Instant | Very High | Recommended - Fastest & best |
| **gemini-1.5-flash** | ⚡ Instant | High | Fast generation |
| **gemini-1.5-flash-image** | ⚡ Instant | High | Image-focused |
| **gemini-1.5-pro** | 🚀 Normal | Highest | Best quality (slower) |

---

## 💰 Pricing

✅ **100% FREE** - No credit card required!
- 15 requests per minute (free tier)
- Unlimited daily usage within quota
- No monthly charges

---

## 🔧 Configuration Options

```env
# Choose your model:
GEMINI_MODEL=gemini-2.0-flash        # RECOMMENDED
GEMINI_MODEL=gemini-1.5-flash        # Alternative
GEMINI_MODEL=gemini-1.5-flash-image  # Image-specific
GEMINI_MODEL=gemini-1.5-pro          # Best quality
```

---

## 🎯 Features

✅ **No API Key Exposure** - Key stays in backend
✅ **Auto Error Handling** - Falls back gracefully
✅ **Rate Limit Friendly** - Respects free tier limits
✅ **Gemini 2.0 Support** - Latest models available
✅ **Full Mode Support** - Image & Logo generation both work

---

## 🐛 Troubleshooting

### "Invalid API Key"
- ✅ Get a new key: https://aistudio.google.com/app/apikeys
- ✅ Make sure it's pasted correctly (no spaces)
- ✅ Restart backend: `npm run backend`

### "Rate limit exceeded"
- ✅ Wait 60 seconds (free tier: 15 req/min)
- ✅ Try again

### "No image generated"
- ✅ Check your prompt (be descriptive)
- ✅ Try a simpler prompt first
- ✅ Check backend logs for errors

---

## ✨ Advantages Over Hugging Face

| Feature | Gemini | HF |
|---------|--------|-----|
| **Free Tier** | ✅ Yes | ✅ Yes |
| **No Loading Time** | ✅ ~1-2s | ❌ 30-60s |
| **Rate Limit** | 15/min | Varies |
| **Model Quality** | Very High | Good |
| **Documentation** | Excellent | Good |

---

## 📚 More Info

- **Gemini API Docs**: https://ai.google.dev/
- **Free API Keys**: https://aistudio.google.com/app/apikeys
- **Pricing**: https://ai.google.dev/pricing

---

**Setup complete! You now have 100% FREE image generation! 🎉**
