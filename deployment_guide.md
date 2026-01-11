# Deployment Guide - One.RGVP.IN

Complete guide for deploying your React application to GitHub and production environments.

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints verified
- [ ] Build process tested locally
- [ ] Dependencies up to date
- [ ] No console errors in production build
- [ ] SEO meta tags configured
- [ ] Performance optimizations applied

## 🚀 GitHub Repository Setup

### 1. Initialize Git Repository

```bash
# Navigate to project directory
cd one.rgvp.in

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete React 19 enterprise application"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Repository name: `one.rgvp.in`
4. Description: "Enterprise React 19 Application with React Router v7"
5. Choose visibility (Public/Private)
6. **Do NOT** initialize with README (we already have one)
7. Click "Create repository"

### 3. Connect Local to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/one.rgvp.in.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Set Up Branch Protection (Recommended)

1. Go to repository Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file (DO NOT commit this):

```env
# Production API Configuration
VITE_URL_APP_API=https://apis.one.rgvp.in
VITE_URL_APP=https://one.rgvp.in
VITE_URL_UPLOADS=https://data.one.rgvp.in/uploads

# Organization Details (or keep in vite.config.js)
VITE_ORG_NAME=RG-VP Web Solutions
```

**Note**: Most constants are in `vite.config.js`. Only add to `.env` if you need different values per environment.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for SSR)

Perfect for React Router v7 SSR applications.

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "devCommand": "npm run dev",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "build/client"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Traditional Server (VPS/Dedicated)

```bash
# Build application
npm run build

# Copy build folder to server
scp -r build/ user@your-server.com:/var/www/one.rgvp.in/

# SSH into server
ssh user@your-server.com

# Install dependencies on server
cd /var/www/one.rgvp.in
npm install --production

# Start application with PM2
pm2 start npm --name "one-rgvp" -- start
pm2 save
pm2 startup
```

**Nginx Configuration** (`/etc/nginx/sites-available/one.rgvp.in`):
```nginx
server {
    listen 80;
    server_name one.rgvp.in www.one.rgvp.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL configuration (after setting up Let's Encrypt)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/one.rgvp.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/one.rgvp.in/privkey.pem;
}
```

### Option 4: Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Deploy:
```bash
# Build image
docker build -t one-rgvp:latest .

# Run container
docker run -d -p 3000:3000 --name one-rgvp one-rgvp:latest

# Or use docker-compose
docker-compose up -d
```

## 🔐 SSL Certificate Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d one.rgvp.in -d www.one.rgvp.in

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/react

# Add to src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### 2. Analytics (Google Analytics)

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Pre-Deployment Testing

```bash
# Run production build locally
npm run build
npm run preview

# Test in different browsers
# - Chrome
# - Firefox
# - Safari
# - Edge

# Check mobile responsiveness
# - iOS Safari
# - Android Chrome

# Verify all features
# - Login/Logout
# - Protected routes
# - Dynamic routing
# - Theme toggle
# - API calls
```

## 📝 Post-Deployment Verification

### Checklist

- [ ] Application loads correctly
- [ ] All routes are accessible
- [ ] Authentication works
- [ ] API endpoints respond
- [ ] Images and assets load
- [ ] Theme switching works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] SSL certificate valid
- [ ] Performance metrics good

### Performance Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://one.rgvp.in

# Or use web interface
# https://pagespeed.web.dev/
```

## 🆘 Troubleshooting

### Common Issues

1. **White screen after deployment**
   - Check browser console for errors
   - Verify API endpoint configuration
   - Check build output in `build/` directory

2. **Routes not working (404)**
   - Configure server rewrites for SPA
   - Check `.htaccess` or nginx config

3. **API calls failing**
   - Verify CORS settings on backend
   - Check API URL in environment variables
   - Test API endpoints directly

4. **Slow initial load**
   - Enable prerendering for static routes
   - Check bundle size with `npm run build`
   - Implement code splitting

## 📞 Support

For deployment issues:
- Email: support@rgvp.in
- GitHub Issues: https://github.com/YOUR_USERNAME/one.rgvp.in/issues

---

**Last Updated**: January 2026  
**Version**: 1.1.0