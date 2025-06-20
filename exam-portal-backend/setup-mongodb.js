const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MongoDB for Examinia');
console.log('=====================================');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/exam-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: MongoDB Atlas (cloud) connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-portal?retryWrites=true&w=majority
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Install MongoDB on your system or use MongoDB Atlas (cloud)');
console.log('2. Update the MONGODB_URI in your .env file');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev');
console.log('\n🔗 MongoDB Installation Links:');
console.log('- Local: https://docs.mongodb.com/manual/installation/');
console.log('- Atlas: https://www.mongodb.com/cloud/atlas'); 