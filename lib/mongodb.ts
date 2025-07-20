import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DB || 'vit_smartbot'

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw new Error('Database connection failed')
  }
}

// Initialize sample data if database is empty
export async function initializeSampleData() {
  try {
    const db = await connectToDatabase()

    // Check if collections exist and have data
    const eventsCount = await db.collection('events').countDocuments()
    const feesCount = await db.collection('fee_deadlines').countDocuments()
    const placementsCount = await db.collection('placement_stats').countDocuments()

    // Insert sample data if collections are empty
    if (eventsCount === 0) {
      await db.collection('events').insertMany([
        {
          title: 'Riviera Cultural Festival',
          description: 'Annual cultural festival with dance, music, and drama competitions',
          date: new Date('2024-02-15'),
          time: '10:00 AM',
          venue: 'Main Auditorium',
          category: 'cultural',
          registrationRequired: true
        },
        {
          title: 'Gravitas Technical Symposium',
          description: 'Technical festival featuring coding competitions and tech talks',
          date: new Date('2024-09-20'),
          time: '9:00 AM',
          venue: 'Tech Tower',
          category: 'technical',
          registrationRequired: true
        },
        {
          title: 'Career Fair 2024',
          description: 'Meet top recruiters and explore career opportunities',
          date: new Date('2024-03-10'),
          time: '11:00 AM',
          venue: 'Convention Center',
          category: 'placement',
          registrationRequired: false
        },
        {
          title: 'AI & ML Workshop',
          description: 'Hands-on workshop on Artificial Intelligence and Machine Learning',
          date: new Date('2024-02-28'),
          time: '2:00 PM',
          venue: 'SCOPE Lab',
          category: 'academic',
          registrationRequired: true
        },
        {
          title: 'Inter-Hostel Sports Meet',
          description: 'Annual sports competition between different hostels',
          date: new Date('2024-03-05'),
          time: '7:00 AM',
          venue: 'Sports Complex',
          category: 'sports',
          registrationRequired: true
        }
      ])
      console.log('Sample events data inserted')
    }

    if (feesCount === 0) {
      await db.collection('fee_deadlines').insertMany([
        {
          type: 'Semester Fee',
          amount: 125000,
          deadline: new Date('2024-03-15'),
          description: 'Tuition fee for Spring semester 2024',
          category: 'academic',
          lateFeePenalty: 2500
        },
        {
          type: 'Hostel Fee',
          amount: 90000,
          deadline: new Date('2024-02-28'),
          description: 'Hostel accommodation fee for current academic year',
          category: 'hostel',
          lateFeePenalty: 1500
        },
        {
          type: 'Examination Fee',
          amount: 2500,
          deadline: new Date('2024-04-10'),
          description: 'Fee for semester end examinations',
          category: 'examination',
          lateFeePenalty: 500
        },
        {
          type: 'Library Fee',
          amount: 5000,
          deadline: new Date('2024-03-01'),
          description: 'Annual library and resource access fee',
          category: 'library',
          lateFeePenalty: 250
        }
      ])
      console.log('Sample fee deadlines data inserted')
    }

    if (placementsCount === 0) {
      await db.collection('placement_stats').insertOne({
        year: 2024,
        placement_percentage: 96.5,
        highest_package: 75.0,
        average_package: 8.5,
        median_package: 7.2,
        companies_count: 520,
        students_placed: 4850,
        total_students: 5025,
        top_companies: [
          'Microsoft', 'Google', 'Amazon', 'Adobe', 'Goldman Sachs',
          'Morgan Stanley', 'TCS', 'Infosys', 'Wipro', 'Cognizant',
          'Cisco', 'Intel', 'Qualcomm', 'Samsung', 'Dell'
        ],
        sectors: {
          IT: 65,
          core: 20,
          consulting: 10,
          research: 5
        },
        internship_stats: {
          percentage: 85,
          companies: 280,
          average_stipend: 25000
        }
      })
      console.log('Sample placement statistics inserted')
    }

    return db
  } catch (error) {
    console.error('Error initializing sample data:', error)
    throw error
  }
}

// Helper function to get collection
export async function getCollection(collectionName: string) {
  const db = await connectToDatabase()
  return db.collection(collectionName)
}

export default clientPromise