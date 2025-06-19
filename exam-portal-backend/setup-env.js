const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const envContent = `SUPABASE_URL=https://ruiyaxkhmzcqymzlgvbm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aXlheGtobXpjcXltemxndmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjE1NTUsImV4cCI6MjA2NTkzNzU1NX0.N3amf3Y2tnUOTI2ZdpTiS9HGggLLLktaq8xIdJ70zB4
JWT_SECRET=exam41255
PORT=5000`;

// Write to .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('✅ Environment variables file created successfully!');
console.log('📁 File location:', path.join(__dirname, '.env'));
console.log('\n🔍 Testing environment variables...');

// Test if the variables are loaded correctly
require('dotenv').config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Set (' + process.env.SUPABASE_KEY.substring(0, 30) + '...)' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT || '❌ Not set'); 