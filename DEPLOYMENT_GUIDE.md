# VIT SmartBot - Deployment Guide 🚀

This guide covers multiple hosting options for deploying your VIT SmartBot to production.

## 🎯 Quick Deployment Options

### 1. 🟢 Vercel (Recommended - Free Tier Available)

**Best for**: Quick deployment, automatic scaling, global CDN

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
npm run deploy:vercel

# Or use the web interface
# 1. Push code to GitHub
# 2. Connect repository at vercel.com
# 3. Deploy automatically
```

**Environment Variables for Vercel:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `MONGODB_DB` - Database name (e.g., `vit_smartbot`)
- `NEXTAUTH_SECRET` - Random secret key
- `NODE_ENV` - Set to `production`

### 2. 🔵 Netlify (Free Tier Available)

**Best for**: Static sites with serverless functions

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
npm run deploy:netlify

# Or drag-and-drop the .next folder to netlify.com
```

### 3. 🐳 Docker (Self-Hosting)

**Best for**: Full control, custom servers, enterprise deployments

```bash
# Single container
npm run docker:build
npm run docker:run

# Full stack with MongoDB
npm run docker:compose

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 4. ☁️ Cloud Platforms

**AWS, Google Cloud, Azure, DigitalOcean, etc.**

---

## 📋 Detailed Deployment Instructions

### 🟢 Vercel Deployment

#### Step 1: Prepare Your Repository
```bash
# Make sure your code is in a Git repository
git init
git add .
git commit -m "Initial VIT SmartBot deployment"
git push origin main
```

#### Step 2: Deploy via Web Interface
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your VIT SmartBot repository
5. Configure environment variables:
   - `MONGODB_URI`: `mongodb+srv://username:password@cluster.mongodb.net/vit_smartbot`
   - `MONGODB_DB`: `vit_smartbot`
   - `NEXTAUTH_SECRET`: Generate a random string
6. Click "Deploy"

#### Step 3: Initialize Database
```bash
# After deployment, initialize the database
curl -X POST https://your-app.vercel.app/api/init-db
```

### 🔵 Netlify Deployment

#### Step 1: Build Configuration
The `netlify.toml` file is already configured. Just ensure you have these environment variables:

```bash
# In Netlify dashboard > Site settings > Environment variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vit_smartbot
MONGODB_DB=vit_smartbot
NEXTAUTH_SECRET=your-random-secret
NODE_ENV=production
```

#### Step 2: Deploy Options

**Option A: Git Integration**
1. Push code to GitHub/GitLab
2. Connect repository in Netlify dashboard
3. Deploy automatically

**Option B: Manual Deploy**
```bash
npm run build
netlify deploy --prod --dir=.next
```

### 🐳 Docker Deployment

#### Step 1: Single Container
```bash
# Build the image
docker build -t vit-smartbot .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://localhost:27017 \
  -e MONGODB_DB=vit_smartbot \
  -e NODE_ENV=production \
  vit-smartbot
```

#### Step 2: Docker Compose (with MongoDB)
```bash
# Start all services
docker-compose up -d

# Services will be available at:
# - VIT SmartBot: http://localhost:3000
# - MongoDB: localhost:27017
# - Mongo Express: http://localhost:8081

# Initialize the database
curl -X POST http://localhost:3000/api/init-db

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### ☁️ Cloud Platform Deployment

#### AWS (Elastic Beanstalk)
1. Install AWS CLI and EB CLI
2. Initialize Elastic Beanstalk application
3. Configure environment variables
4. Deploy using `eb deploy`

#### Google Cloud (App Engine)
1. Create `app.yaml` configuration
2. Use `gcloud app deploy`
3. Configure environment variables in Cloud Console

#### DigitalOcean (App Platform)
1. Connect GitHub repository
2. Configure build and run commands
3. Set environment variables
4. Deploy automatically

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Cloud Deployments)

1. **Create Account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier M0
3. **Setup Security**:
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for development)
4. **Get Connection String**: 
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vit_smartbot
   ```
5. **Initialize Data**:
   ```bash
   curl -X POST https://your-app-url.com/api/init-db
   ```

### Local MongoDB (for Self-Hosting)

```bash
# Install MongoDB locally
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb/brew/mongodb-community

# Start MongoDB
sudo systemctl start mongod

# Connection string for local MongoDB
MONGODB_URI=mongodb://localhost:27017
```

---

## 🔧 Environment Variables Guide

### Required Variables
```bash
MONGODB_URI=mongodb://your-connection-string
MONGODB_DB=vit_smartbot
NODE_ENV=production
NEXTAUTH_SECRET=your-random-secret-key
```

### Optional Variables (Future Features)
```bash
VTOP_API_URL=https://vtop.vit.ac.in/api
VTOP_API_KEY=your-vtop-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Generating Secrets
```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://generate-secret.vercel.app/32
```

---

## 🔍 Health Checks & Monitoring

### Health Check Endpoint
```bash
# Check if your deployment is healthy
curl https://your-app-url.com/api/health

# Response example:
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "service": "VIT SmartBot",
  "version": "1.0.0",
  "uptime": 3600,
  "environment": "production",
  "checks": {
    "api": "operational",
    "nlp": "operational",
    "database": "configured"
  }
}
```

### Monitoring Setup

**Vercel**: Built-in analytics and monitoring
**Netlify**: Analytics dashboard available
**Docker**: Use tools like Grafana, Prometheus
**Cloud Platforms**: Native monitoring services

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Database Connection Issues
```bash
# Test MongoDB connection
curl -X POST https://your-app-url.com/api/init-db

# Check environment variables
# Ensure MONGODB_URI is correctly formatted
```

#### 3. API Route Errors
```bash
# Check logs in deployment platform
# Verify environment variables are set
# Test individual API endpoints
```

#### 4. Memory/Performance Issues
```bash
# For Docker, increase memory limits
docker run -m 512m vit-smartbot

# For cloud platforms, upgrade to higher tier
# Optimize database queries and caching
```

### Debug Commands
```bash
# Check deployment status
npm run health

# Test chatbot API
curl -X POST https://your-app-url.com/api/chatbot-demo \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Initialize database
npm run init-db
```

---

## 📊 Performance Optimization

### For Production

1. **Enable Compression**: Automatically handled by Next.js
2. **Use CDN**: Vercel/Netlify provide this automatically
3. **Database Indexing**: Add indexes to MongoDB collections
4. **Caching**: Implement Redis for API response caching
5. **Image Optimization**: Use Next.js Image component

### Scaling Considerations

- **Horizontal Scaling**: Use load balancers
- **Database Scaling**: MongoDB Atlas auto-scaling
- **Caching**: Implement Redis or Memcached
- **Monitoring**: Set up alerts for performance metrics

---

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] Database credentials are not in code
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Rate limiting is configured
- [ ] Security headers are set

---

## 🎉 Post-Deployment Steps

1. **Test All Features**: Use the health check and try various queries
2. **Initialize Database**: Run the init-db endpoint
3. **Setup Monitoring**: Configure alerts and logging
4. **Update DNS**: Point your domain to the deployment
5. **Share with Users**: Your VIT SmartBot is live!

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check GitHub issues
4. Contact platform support

**Your VIT SmartBot is now ready for production! 🚀**

Choose the deployment method that best fits your needs and budget. The demo mode ensures your bot works even without a database connection, making deployment flexible and reliable.