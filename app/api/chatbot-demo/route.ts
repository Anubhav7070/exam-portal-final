import { NextRequest, NextResponse } from 'next/server'
import { processNaturalLanguage } from '@/lib/nlp'

export async function POST(request: NextRequest) {
  try {
    const { message, category } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Process the message with NLP to understand intent and extract entities
    const nlpResult = processNaturalLanguage(message.toLowerCase())
    
    // Determine the response category if not provided
    const responseCategory = category || nlpResult.category || 'general'

    // Generate response using fallback data (no database required)
    const response = generateDemoResponse(nlpResult, responseCategory, message)

    return NextResponse.json({
      response: response.text,
      category: responseCategory,
      intent: nlpResult.intent,
      confidence: nlpResult.confidence,
      demo: true
    })

  } catch (error) {
    console.error('Chatbot Demo API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateDemoResponse(nlpResult: any, category: string, originalMessage: string) {
  const { intent, confidence } = nlpResult

  // High confidence responses based on intent
  if (confidence > 0.2) {
    switch (intent) {
      case 'query_hostel_facilities':
        return {
          text: `🏠 **VIT Vellore Hostel Facilities** (Demo Mode)

**Accommodation Types:**
✅ AC and Non-AC rooms (single, double, triple sharing)
✅ Separate hostels for men and women
✅ 24/7 security and CCTV surveillance

**Dining Facilities:**
🍽️ Multi-cuisine mess with vegetarian and non-vegetarian options
🍕 Food courts and cafeterias across campus
🥗 Special dietary accommodations available

**Amenities:**
📶 High-speed Wi-Fi connectivity
👕 Laundry services
🎮 Recreation rooms with TV and games
💪 Gym and sports facilities
🏥 Medical center with 24/7 emergency care

📍 **Location:** All hostels are within walking distance of academic blocks.

*This is demo data. For real-time information, connect to MongoDB database.*`,
          category: 'hostel'
        }

      case 'query_placements':
        return {
          text: `💼 **VIT Vellore Placement Highlights** (Demo Mode)

📊 **2024 Statistics:**
• Overall placement percentage: 96.5%
• Highest package: ₹75.0 LPA
• Average package: ₹8.5 LPA
• Total companies visited: 520+

🏢 **Top Recruiters:**
• Microsoft, Google, Amazon, Adobe
• Goldman Sachs, Morgan Stanley
• TCS, Infosys, Wipro, Cognizant
• Cisco, Intel, Qualcomm

💼 **Popular Sectors:**
• Information Technology (65%)
• Core Engineering (20%)
• Consulting & Finance (10%)
• Research & Development (5%)

🎯 **Placement Process:**
1. Pre-placement talks and company presentations
2. Online aptitude and technical tests
3. Technical and HR interviews
4. Final selection and offer letters

*This is demo data. Connect to MongoDB for real-time placement statistics.*`,
          category: 'placements'
        }

      case 'query_courses':
        return {
          text: `📚 **VIT Vellore Academic Programs** (Demo Mode)

🎓 **Undergraduate Programs (B.Tech):**
• Computer Science & Engineering (CSE)
• Electronics & Communication Engineering (ECE)
• Mechanical Engineering (ME)
• Civil Engineering (CE)
• Information Technology (IT)
• Electrical & Electronics Engineering (EEE)
• Aerospace Engineering
• Biomedical Engineering

🔬 **Specializations Available:**
• Artificial Intelligence & Machine Learning
• Data Science & Analytics
• Cyber Security
• IoT & Embedded Systems
• Robotics & Automation

🎯 **Postgraduate Programs:**
• M.Tech in various specializations
• MBA (Full-time & Executive)
• MCA, M.Sc, M.Des
• Ph.D programs

📝 **Admission:** Through VITEEE for UG programs

*This is demo data. For detailed curriculum information, connect to database.*`,
          category: 'courses'
        }

      case 'query_faculty':
        return {
          text: `👨‍🏫 **VIT Vellore Faculty Information** (Demo Mode)

🌟 **Faculty Highlights:**
• 1800+ full-time faculty members
• 90%+ faculty with Ph.D qualifications
• Faculty from prestigious institutions (IITs, IISc, NITs)
• International faculty exchange programs

📧 **Contact Methods:**
1. **Official Email:** firstname.lastname@vit.ac.in
2. **Department Offices:** Visit respective department offices
3. **Office Hours:** Most faculty have designated consultation hours
4. **VTOP Portal:** Message feature for registered students

🏢 **Department Contacts:**
• CSE: cse@vit.ac.in
• ECE: ece@vit.ac.in
• ME: mech@vit.ac.in
• Civil: civil@vit.ac.in

📱 **Resources:**
• Faculty profiles on VIT website
• Research interests and publications
• Office locations in department blocks

*This is demo data. For specific faculty details, connect to database.*`,
          category: 'faculty'
        }

      case 'query_events':
        return {
          text: `🎉 **VIT Vellore Events** (Demo Mode)

🎊 **Major Annual Events:**
• **Riviera:** Cultural festival (February)
• **Gravitas:** Technical festival (September)
• **Milan:** Sports festival
• **VIT Model United Nations (VITMUN)**

📅 **Sample Upcoming Events:**
🎯 **AI & ML Workshop**
📍 SCOPE Lab | 📅 Next Week | ⏰ 2:00 PM

🎯 **Career Fair 2024**
📍 Convention Center | 📅 March 10 | ⏰ 11:00 AM

🎯 **Inter-Hostel Sports Meet**
📍 Sports Complex | 📅 March 5 | ⏰ 7:00 AM

📚 **Academic Events:**
• Guest lectures by industry experts
• Research symposiums and conferences
• Workshop and training programs

*This is demo data. Connect to MongoDB for real-time event information.*`,
          category: 'events'
        }

      case 'query_fees':
        return {
          text: `💰 **VIT Vellore Fee Information** (Demo Mode)

📋 **Fee Types:**
• Tuition fees (varies by category and program)
• Hostel fees (₹1.8L - ₹2.5L per year)
• Mess charges (₹55,000 - ₹65,000 per year)
• Examination fees
• Library and lab fees

📅 **Sample Upcoming Deadlines:**
💳 **Semester Fee**
📅 Due: March 15 | 💵 Amount: ₹1,25,000

💳 **Hostel Fee**
📅 Due: February 28 | 💵 Amount: ₹90,000

💳 **Payment Methods:**
• Online payment through VIT portal
• Demand Draft in favor of "VIT University"
• Bank transfer (NEFT/RTGS)

📞 **Finance Office:** finance@vit.ac.in | 0416-2202030

*This is demo data. Connect to MongoDB for real-time fee deadlines.*`,
          category: 'fees'
        }

      case 'query_campus_navigation':
        return {
          text: `🗺️ **VIT Vellore Campus Navigation** (Demo Mode)

📍 **Campus Layout:**
• **Academic Blocks:** TT (Tech Tower), SMV, SJT, CDMM
• **Hostels:** Men's (A,B,C,D blocks), Women's (L,M,N,P blocks)
• **Main Building:** Administrative offices, library
• **Facilities:** Hospital, sports complex, food courts

🚗 **Transportation:**
• Free shuttle service between hostels and academic blocks
• Well-marked pedestrian walkways
• Bicycle rentals at various points
• Auto-rickshaws available inside campus

📱 **Navigation Tools:**
• Campus map on VIT website and mobile app
• Google Maps integration (VIT campus mapped)
• Interactive campus directories

🔮 **Future Feature:** Integration with Google Maps API for real-time navigation coming soon!

*This is demo data. Full GPS navigation requires Google Maps API integration.*`,
          category: 'campus'
        }

      default:
        break
    }
  }

  // Fallback response for demo mode
  return {
    text: `🤖 **VIT SmartBot Demo Mode**

Hello! I'm VIT SmartBot running in demo mode. I can help you with:

🏠 **Hostel Life:** Facilities, food, accommodation
📚 **Courses:** Programs, curriculum, admissions  
💼 **Placements:** Statistics, companies, preparation
👨‍🏫 **Faculty:** Contact info, departments, advisors
🗺️ **Campus:** Navigation, facilities, locations
📅 **Events:** Upcoming events, festivals, activities
💰 **Fees:** Payment deadlines, methods, amounts

You asked: "${originalMessage}"

Try asking specific questions like:
• "What are the hostel facilities?"
• "Tell me about placement statistics"
• "How do I contact CSE faculty?"

💡 **Note:** This is demo mode with sample data. For real-time information, connect to MongoDB database and initialize with actual VIT data.`,
    category: 'general'
  }
}