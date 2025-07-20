#!/bin/bash

echo "🚀 VIT SmartBot Deployment Script"
echo "================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔍 Pre-deployment checks..."
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the right directory?"
    exit 1
fi

# Check if Next.js app
if ! grep -q "next" package.json; then
    echo "⚠️  This doesn't appear to be a Next.js project"
fi

echo "✅ Pre-deployment checks passed!"
echo ""

# Build the project locally first
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Local build successful!"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "Follow these prompts:"
echo "1. Set up and deploy? → Y"
echo "2. Which scope? → Choose your account"
echo "3. Link to existing project? → N"
echo "4. Project name? → vit-smartbot (or your preferred name)"
echo "5. Directory? → ./ (current directory)"
echo "6. Want to override settings? → N"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📱 Your VIT SmartBot is now live!"
    echo "🌐 Check your Vercel dashboard for the live URL"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the chatbot functionality"
    echo "2. Check /api/health endpoint"
    echo "3. Set up MongoDB Atlas if needed"
    echo "4. Configure custom domain (optional)"
    echo ""
    echo "🎓 Happy coding! VIT students will love this bot!"
else
    echo "❌ Deployment failed. Check the error messages above."
    echo "💡 Try running 'vercel login' first if authentication failed."
fi