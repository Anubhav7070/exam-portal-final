# 🚀 VIT SmartBot Hosting Guide

## Quick Deployment Options

### 🌟 **Option 1: Vercel (Recommended - Free & Easy)**

#### **Step 1: Prerequisites**
```bash
# Install Vercel CLI (already done)
npm install -g vercel
```

#### **Step 2: Deploy to Vercel**
```bash
# Login to Vercel
vercel login

# Deploy the app
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: vit-smartbot
# - Directory: ./
# - Want to override settings? N
```

#### **Step 3: Environment Variables (Optional - for MongoDB)**
If you want to use MongoDB Atlas:
1. Go to your Vercel dashboard
2. Click on your project → Settings → Environment Variables
3. Add these variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vit_smartbot
   MONGODB_DB=vit_smartbot
   NODE_ENV=production
   ```

#### **Step 4: Access Your App**
Your app will be live at: `https://vit-smartbot.vercel.app`

---

### 🌐 **Option 2: Netlify**

#### **Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

#### **Step 2: Deploy to Netlify**
```bash
# Login to Netlify
netlify login

# Deploy the app
netlify deploy --prod

# Follow the prompts and select the build directory
```

---

### 🚂 **Option 3: Railway (Great for Full-Stack)**

#### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **Step 2: Deploy to Railway**
```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

### 🐳 **Option 4: Docker + Any Cloud Platform**

#### **Step 1: Build Docker Image**
```bash
# Build the image
docker build -t vit-smartbot .

# Run locally to test
docker run -p 3000:3000 vit-smartbot
```

#### **Step 2: Deploy to Cloud**
- **Google Cloud Run**
- **AWS ECS**
- **Azure Container Instances**
- **DigitalOcean App Platform**

---

## 🔧 **Production Setup (Optional)**

### **MongoDB Atlas Setup (Free Tier)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add it to your environment variables

### **Custom Domain**
1. Buy a domain from any provider
2. In Vercel/Netlify dashboard, go to Domains
3. Add your custom domain
4. Update DNS records as instructed

---

## 🎯 **Quick Start (1-Click Deploy)**

### **Deploy to Vercel with 1-Click**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anubhav7070/exam-portal-final&branch=cursor/develop-vit-smartbot-student-assistant-ee4b)

### **Deploy to Netlify with 1-Click**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Anubhav7070/exam-portal-final)

---

## 📊 **Post-Deployment Checklist**

- [ ] ✅ App loads correctly
- [ ] ✅ Chatbot responds to messages
- [ ] ✅ Quick questions work
- [ ] ✅ Demo mode works if MongoDB is unavailable
- [ ] ✅ Health check endpoint (`/api/health`) returns 200
- [ ] ✅ Mobile responsive design works
- [ ] ✅ All 7 categories function properly

---

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **Build Fails**: Check Node.js version (should be 18+)
2. **MongoDB Connection**: Use demo mode or set up MongoDB Atlas
3. **Environment Variables**: Ensure all required vars are set
4. **API Routes**: Check `/api/health` for service status

### **Support:**
- Check deployment logs in your platform dashboard
- Test locally with `npm run dev`
- Use health check endpoint for debugging

---

## 🎉 **Success!**
Your VIT SmartBot is now live and helping VIT Vellore students! 🎓