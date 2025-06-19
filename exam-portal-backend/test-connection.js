const supabase = require('./db/supabaseClient');

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('1. Check your SUPABASE_URL and SUPABASE_KEY in .env file');
      console.log('2. Make sure your Supabase project is active');
      console.log('3. Verify the database tables are created');
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Users table is accessible');
    }
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection(); 