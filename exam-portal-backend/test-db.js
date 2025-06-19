const supabase = require('./db/supabaseClient');

async function testDatabase() {
  console.log('Testing database connection and table structure...');

  try {
    // Test users table
    console.log('\nTesting users table:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('Error accessing users table:', usersError);
    } else {
      console.log('✅ Users table is accessible');
      console.log('Sample data:', users);
    }

    // Test table structure
    console.log('\nTesting table structure:');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('test_table_structure');
    
    if (tableError) {
      console.error('Error getting table structure:', tableError);
    } else {
      console.log('✅ Table structure verified');
      console.log('Table info:', tableInfo);
    }

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testDatabase(); 