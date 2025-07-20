#!/bin/bash

echo "🤖 VIT SmartBot - Starting up..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📄 Creating environment configuration..."
    cp .env.local.example .env.local
    echo "✅ Environment file created (.env.local)"
    echo "💡 You can edit .env.local to configure MongoDB connection"
else
    echo "✅ Environment file exists"
fi

echo ""
echo "🚀 Starting VIT SmartBot development server..."
echo "📱 The chatbot will be available at: http://localhost:3000/chatbot"
echo "🏠 Main page will be at: http://localhost:3000"
echo ""
echo "💡 Note: The bot will run in demo mode if MongoDB is not connected"
echo "   To connect to MongoDB, update MONGODB_URI in .env.local"
echo ""
echo "⭐ Features available:"
echo "   🏠 Hostel facilities information"
echo "   💼 Placement statistics and companies"
echo "   📚 Course details and curriculum"
echo "   👨‍🏫 Faculty contact information"
echo "   🗺️ Campus navigation help"
echo "   📅 Events and activities"
echo "   💰 Fee deadlines and payment info"
echo ""
echo "🔧 To stop the server, press Ctrl+C"
echo "=================================="

# Start the development server
npm run dev