require('dotenv').config();

console.log('Environment Variable Test');
console.log('========================');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL || 'Not set');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Set (length: ' + process.env.SUPABASE_KEY.length + ')' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');

// Check if .env file exists
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

console.log('\nFile Check');
console.log('==========');
console.log('.env file exists:', fs.existsSync(envPath) ? 'Yes' : 'No');

if (fs.existsSync(envPath)) {
  console.log('\n.env File Contents');
  console.log('================');
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log(envContents.replace(/SUPABASE_KEY=.+/g, 'SUPABASE_KEY=[HIDDEN]'));
} 