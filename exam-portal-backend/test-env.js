require('dotenv').config();

console.log('Testing environment variables...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set (' + process.env.SUPABASE_URL.substring(0, 30) + '...)' : 'Missing');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Set (' + process.env.SUPABASE_KEY.substring(0, 30) + '...)' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
console.log('PORT:', process.env.PORT || 'Not set'); 