# VIT SmartBot 🤖

**VIT SmartBot** is an intelligent chatbot designed specifically for VIT Vellore students to help resolve doubts about hostel life, courses, placements, faculty, and campus navigation. Built with Next.js, TypeScript, and MongoDB, it features natural language processing, a modern UI, and extensive VIT-specific knowledge.

## ✨ Features

### 🎯 Core Functionality
- **Natural Language Processing**: Understands student queries in conversational language
- **Multi-Category Support**: Handles questions about:
  - 🏠 Hostel life and facilities
  - 📚 Courses and academic programs
  - 💼 Placements and career guidance
  - 👨‍🏫 Faculty contact information
  - 🗺️ Campus navigation
  - 📅 Events and activities
  - 💰 Fee deadlines and payments

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Quick Questions**: Pre-built common queries for instant help
- **Real-time Chat**: Smooth messaging experience with typing indicators
- **Category Badges**: Visual indicators for different types of queries
- **Message History**: Persistent chat history during session

### 🗄️ Data Management
- **MongoDB Integration**: Stores events, fee deadlines, and placement statistics
- **Fallback Responses**: Comprehensive fallback data when database is unavailable
- **Real-time Data**: Fetches current information about events and deadlines

### 🚀 Future-Ready
- **VTOP Integration Ready**: Placeholder for student portal integration
- **Google Maps Support**: Campus navigation with map integration
- **Extensible Architecture**: Easy to add new features and data sources

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **NLP**: Natural language processing library
- **Icons**: Lucide React
- **Styling**: Modern gradients and animations

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB (local installation or MongoDB Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vit-smartbot
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=vit_smartbot
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

### 5. Initialize Database
```bash
# Start the development server first
npm run dev

# Then initialize the database with sample data
curl -X POST http://localhost:3000/api/init-db
```

### 6. Access the Application
Open [http://localhost:3000/chatbot](http://localhost:3000/chatbot) in your browser.

## 📁 Project Structure

```
vit-smartbot/
├── app/
│   ├── api/
│   │   ├── chatbot/          # Main chatbot API
│   │   └── init-db/          # Database initialization
│   ├── chatbot/              # Chatbot page
│   └── globals.css
├── components/
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── mongodb.ts            # Database connection & sample data
│   ├── nlp.ts               # Natural language processing
│   └── vit-data.ts          # VIT-specific data & utilities
├── .env.local.example        # Environment variables template
└── README.md
```

## 🎮 Usage

### Basic Chat
1. Open the chatbot interface
2. Type your question in natural language
3. Get instant responses with relevant information

### Quick Questions
- Click on pre-built question buttons for common queries
- Each category (hostel, placements, etc.) has dedicated quick access

### Sample Questions to Try
- "What are the hostel facilities?"
- "Tell me about placement statistics"
- "How do I contact CSE faculty?"
- "What courses are available?"
- "Show me upcoming events"
- "When are the fee deadlines?"
- "Help me navigate to the library"

## 🧠 Natural Language Processing

The bot uses sophisticated NLP to understand:
- **Intent Recognition**: Identifies what the user wants to know
- **Entity Extraction**: Extracts specific information (departments, dates, amounts)
- **Context Awareness**: Maintains conversation context
- **Confidence Scoring**: Provides relevant responses based on understanding level

### Supported Intents
- `query_hostel_facilities`
- `query_placements`
- `query_courses`
- `query_faculty`
- `query_events`
- `query_fees`
- `query_campus_navigation`

## 🗃️ Database Schema

### Events Collection
```javascript
{
  title: "Event Name",
  description: "Event description",
  date: Date,
  time: "10:00 AM",
  venue: "Venue Name",
  category: "cultural|technical|academic|sports",
  registrationRequired: Boolean
}
```

### Fee Deadlines Collection
```javascript
{
  type: "Fee Type",
  amount: Number,
  deadline: Date,
  description: "Fee description",
  category: "academic|hostel|examination",
  lateFeePenalty: Number
}
```

### Placement Statistics Collection
```javascript
{
  year: 2024,
  placement_percentage: 96.5,
  highest_package: 75.0,
  average_package: 8.5,
  companies_count: 520,
  top_companies: ["Company1", "Company2"],
  sectors: { IT: 65, core: 20, consulting: 10, research: 5 }
}
```

## 🔮 Future Enhancements

### Phase 1: VTOP Integration
- **Student Authentication**: Login with VIT credentials
- **Personal Data**: Access to CGPA, attendance, timetable
- **Exam Schedules**: Personalized exam information
- **Course Registration**: Help with course selection

### Phase 2: Advanced Campus Navigation
- **Real-time Location**: GPS-based navigation
- **Interactive Maps**: Detailed campus maps with search
- **Shuttle Tracking**: Real-time shuttle bus locations
- **Route Optimization**: Best paths between locations

### Phase 3: Enhanced AI Features
- **Voice Interface**: Speech-to-text and text-to-speech
- **Multilingual Support**: Tamil and Hindi language support
- **Predictive Assistance**: Proactive suggestions and reminders
- **Learning Analytics**: Personalized academic recommendations

### Phase 4: Community Features
- **Student Forums**: Integrated discussion boards
- **Peer Matching**: Connect students with similar interests
- **Event RSVP**: Direct event registration
- **Feedback System**: Continuous improvement through user feedback

## 🔧 API Endpoints

### Chatbot API
```
POST /api/chatbot
Body: { message: string, category?: string }
Response: { response: string, category: string, intent: string, confidence: number }
```

### Database Initialization
```
POST /api/init-db
Response: { message: string, status: string }
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add proper error handling
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017` |
| `MONGODB_DB` | Database name | Yes | `vit_smartbot` |
| `NODE_ENV` | Environment mode | No | `development` |
| `VTOP_API_URL` | VTOP API endpoint (future) | No | - |
| `VTOP_API_KEY` | VTOP API key (future) | No | - |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key (future) | No | - |

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if MongoDB is running
mongod --version
# Verify connection string in .env.local
```

**Missing Dependencies**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Route Not Found**
```bash
# Ensure you're running the development server
npm run dev
# Check the API route exists in app/api/
```

**NLP Library Issues**
```bash
# Install natural language processing dependencies
npm install natural
# Check for Node.js compatibility
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@vitsmartbot.com or join our Discord community.

## 🙏 Acknowledgments

- VIT Vellore for the inspiration and data
- The open-source community for amazing tools and libraries
- Students who will use and improve this bot

---

**Made with ❤️ for VIT Vellore students**

*VIT SmartBot - Making campus life easier, one question at a time!*