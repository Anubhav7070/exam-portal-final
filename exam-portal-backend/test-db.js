const supabase = require('./db/supabaseClient');

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Response:', data);
    return true;
  } catch (err) {
    console.error('❌ Database test failed:', err);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('🎉 Database is working correctly!');
    } else {
      console.log('💥 Database connection failed!');
    }
    process.exit(success ? 0 : 1);
  }); 