const { connectDB } = require('./db/mongodb');

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await connectDB();
    
    console.log('✅ MongoDB connection successful!');
    console.log('🎉 Your MongoDB database is ready to use.');
    
    // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check your MONGODB_URI in the .env file');
    console.log('3. For local MongoDB, ensure the service is started');
    console.log('4. For MongoDB Atlas, check your connection string and IP whitelist');
    
    process.exit(1);
  }
};

// Run the test
testConnection(); 