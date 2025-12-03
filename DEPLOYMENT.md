# 🚀 DEPLOYMENT GUIDE

Complete guide for deploying the AI Image & Logo Generator to production.

## Quick Start - Vercel + Render

**Frontend → Vercel (Free)**
**Backend → Render (Free)**

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to GitHub (optional)
# - Set project name
# - Build command: npm run build
# - Output directory: dist

# Get your URL: https://your-project.vercel.app
```

### 2. Deploy Backend to Render

```bash
# Push backend to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Go to https://render.com
# Click "New +" → "Web Service"
# Connect GitHub repository

# Configure:
# Name: ai-image-logo-generator-api
# Runtime: Node
# Build command: npm install
# Start command: npm start

# Add Environment Variables:
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
PROVIDER=huggingface
PORT=3000

# Deploy and get your URL: https://ai-image-logo-generator-api.onrender.com
```

### 3. Connect Frontend to Backend

Update `frontend/.env.production`:
```env
VITE_API_URL=https://ai-image-logo-generator-api.onrender.com
```

Redeploy frontend:
```bash
cd frontend
vercel --prod
```

---

## Detailed Platform Instructions

### Option A: Railway.app (Recommended)

#### Setup Backend on Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Create backend service
cd backend

# Set environment variables
railway variables set HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
railway variables set HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
railway variables set PROVIDER=huggingface

# Deploy
railway up

# Get public URL from Railway dashboard
# Add to frontend VITE_API_URL
```

#### Setup Frontend on Vercel

```bash
cd frontend
vercel --prod
```

---

### Option B: Docker Deployment (Advanced)

#### Create Docker Files

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

**docker-compose.yml** (in root):
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
      - PROVIDER=huggingface
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

#### Run with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Access:
# Frontend: http://localhost
# Backend: http://localhost:3000
```

---

### Option C: AWS Deployment

#### EC2 Instance

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Clone repo and setup:
   ```bash
   git clone <your-repo>
   cd Prompt-To-Image-Generator
   npm run install-all
   ```

5. Create `.env` files with secrets

6. Install PM2 for process management:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start "npm start" --name "api"
   pm2 save
   ```

7. Setup Nginx reverse proxy:
   ```bash
   sudo apt-get install nginx
   # Configure /etc/nginx/sites-available/default
   # Point to backend on localhost:3000
   ```

8. Enable HTTPS with Let's Encrypt:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d yourdomain.com
   ```

#### RDS Database (Optional Future)

For user accounts, use AWS RDS:
```bash
# In backend, add database connection
npm install sequelize pg
```

---

### Option D: Azure App Service

1. Login to Azure Portal
2. Create "App Service"
3. Choose Node.js runtime
4. Deploy from GitHub:
   ```bash
   az webapp deployment github-actions create
   ```

5. Add Application Settings:
   - `HUGGINGFACE_API_KEY`
   - `HUGGINGFACE_MODEL`
   - `PROVIDER`

6. GitHub Actions will auto-deploy on push

---

### Option E: DigitalOcean App Platform

1. Go to DigitalOcean.com
2. Create "App"
3. Connect GitHub repository
4. Add services:
   - Backend (Node.js, port 3000)
   - Frontend (Static Site)

5. Set environment variables in dashboard
6. Deploy automatically on push

---

## Production Checklist

- [ ] Use strong, unique API key
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up error logging (Sentry, Rollbar)
- [ ] Enable CORS restrictions
- [ ] Set up monitoring/uptime checks
- [ ] Configure auto-scaling (if needed)
- [ ] Setup database backups
- [ ] Enable rate limiting
- [ ] Setup analytics
- [ ] Monitor API usage/costs
- [ ] Setup CDN for frontend (Cloudflare)
- [ ] Enable security headers
- [ ] Setup email notifications
- [ ] Document deployment process

---

## Environment Variables (Production)

### Backend

```env
# Required
HUGGINGFACE_API_KEY=hf_xxxxx_your_secret_key_xxxxx
HUGGINGFACE_MODEL=stable-diffusion-xl-base-1.0
PROVIDER=huggingface

# Server
PORT=3000
NODE_ENV=production

# Optional - for logging/monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
LOG_LEVEL=info
```

### Frontend

```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=AI Image Generator
```

---

## Monitoring & Logging

### Sentry (Error Tracking)

**Backend:**
```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend:**
```bash
npm install @sentry/react
```

---

### PM2 (Process Manager)

```bash
# Install
npm install -g pm2

# Start app
pm2 start src/server.js --name "api"

# Monitor
pm2 monit

# Setup auto-restart
pm2 startup
pm2 save

# View logs
pm2 logs api
```

---

## Performance Optimization

### Frontend
```bash
# Optimize bundle
npm run build
# Check size
npm install -g serve
serve dist

# Use CDN
# Add Cloudflare in front of Vercel
```

### Backend
```javascript
// Add caching headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});

// Compress responses
npm install compression
app.use(compression());
```

### Image Optimization
- Store generated images in cloud storage (S3, GCS)
- Implement image resizing for thumbnails
- Use WebP format for modern browsers

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single backend server
- Vercel/Netlify frontend
- Hugging Face free tier

### Phase 2: Growth
- Add Redis caching for common prompts
- Store images in S3/GCS
- Load balance backend servers
- Setup CDN (Cloudflare)

### Phase 3: Scale
- Database for user accounts
- Queue system (Bull/RabbitMQ) for generation jobs
- Kubernetes for container orchestration
- Custom ML model fine-tuning
- Payment system for premium features

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel (Frontend) | 100GB bandwidth | Free |
| Render (Backend) | 750 hours/month | Free |
| Hugging Face API | ~200k requests/month | Free |
| Domain | .com | $10-15/year |
| Email service | 5000/month | Free |
| **Total** | **~200k requests** | **~$15/year** |

**Premium upgrades:**
- Render: $7/month → 100GB bandwidth
- Vercel: $20/month → Analytics, KV storage
- Hugging Face: $9/month → Priority queue

---

## Backup & Recovery

### GitHub Backups
```bash
# Daily automatic backups
# Use GitHub as single source of truth
git push origin main
```

### Environment Backup
```bash
# Save environment variables securely
# Use 1Password, LastPass, or AWS Secrets Manager
```

### Database Backup (Future)
```bash
# If adding database:
# Use automated backups on platform
# Weekly export to S3
```

---

## Rolling Back

### If deployment breaks:

```bash
# Vercel
vercel --prod --prev  # Use previous deployment

# Render
# Click previous deployment in dashboard

# Manual rollback
git revert <commit-hash>
git push origin main
# Redeploy
```

---

## Security Hardening

```javascript
// backend/src/server.js

// Add security headers
import helmet from 'helmet';
app.use(helmet());

// Add rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Validate inputs
app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  // Sanitize: Remove HTML, truncate length, etc.
  if (prompt.length > 500) {
    return res.status(400).json({ error: 'Prompt too long' });
  }
});

// CORS - restrict to frontend only
const corsOptions = {
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
```

---

## Troubleshooting Deployment

### "Build failed"
- Check build logs on platform
- Verify all dependencies listed
- Check environment variables set

### "API not responding"
- Check if backend is running
- Verify CORS configuration
- Check firewall/port access

### "Images not generating"
- Verify API key is valid
- Check Hugging Face account status
- Review server logs
- Check request payload format

### "Slow response time"
- Model may be loading (free tier)
- Check network latency
- Consider model upgrade
- Setup caching

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Express Deployment**: https://expressjs.com/en/advanced/best-practice-security.html
- **Hugging Face API**: https://huggingface.co/docs/api-inference
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance/

---

**Deployment completed! 🚀**

Your app is now live and accessible to the world!
