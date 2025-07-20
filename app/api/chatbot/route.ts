import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { processNaturalLanguage } from '@/lib/nlp'
import { getVITData } from '@/lib/vit-data'

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

    // Connect to MongoDB to fetch relevant data
    let dbData = null
    try {
      const db = await connectToDatabase()
      
      // Fetch relevant data based on category and intent
      if (nlpResult.intent === 'query_events' || responseCategory === 'events') {
        dbData = await db.collection('events').find({
          date: { $gte: new Date() }
        }).sort({ date: 1 }).limit(5).toArray()
      } else if (nlpResult.intent === 'query_fees' || responseCategory === 'fees') {
        dbData = await db.collection('fee_deadlines').find({
          deadline: { $gte: new Date() }
        }).sort({ deadline: 1 }).limit(3).toArray()
      } else if (nlpResult.intent === 'query_placements' || responseCategory === 'placements') {
        dbData = await db.collection('placement_stats').findOne({
          year: new Date().getFullYear()
        })
      }
    } catch (dbError) {
      console.log('Database connection failed, using fallback data')
    }

    // Generate response based on intent, category, and available data
    const response = generateResponse(nlpResult, responseCategory, message, dbData)

    return NextResponse.json({
      response: response.text,
      category: responseCategory,
      intent: nlpResult.intent,
      confidence: nlpResult.confidence
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateResponse(nlpResult: any, category: string, originalMessage: string, dbData: any) {
  const { intent, entities, confidence } = nlpResult

  // High confidence responses based on intent
  if (confidence > 0.7) {
    switch (intent) {
      case 'query_hostel_facilities':
        return {
          text: `VIT Vellore offers excellent hostel facilities including:

🏠 **Accommodation Types:**
- AC and Non-AC rooms (single, double, triple sharing)
- Separate hostels for men and women
- 24/7 security and CCTV surveillance

🍽️ **Dining:**
- Multi-cuisine mess with vegetarian and non-vegetarian options
- Food courts and cafeterias across campus
- Special dietary accommodations available

⚡ **Amenities:**
- High-speed Wi-Fi connectivity
- Laundry services
- Recreation rooms with TV and games
- Gym and sports facilities
- Medical center with 24/7 emergency care

📍 **Location:** All hostels are within walking distance of academic blocks.

Would you like specific information about any particular hostel or facility?`,
          category: 'hostel'
        }

      case 'query_placements':
        if (dbData) {
          return {
            text: `Here are the latest placement statistics for VIT Vellore:

📊 **${dbData.year} Placement Highlights:**
- Overall placement percentage: ${dbData.placement_percentage}%
- Highest package: ₹${dbData.highest_package} LPA
- Average package: ₹${dbData.average_package} LPA
- Total companies visited: ${dbData.companies_count}+

🏢 **Top Recruiters:**
${dbData.top_companies.slice(0, 5).map((company: string) => `• ${company}`).join('\n')}

💼 **Popular Sectors:**
- Information Technology (${dbData.sectors.IT}%)
- Core Engineering (${dbData.sectors.core}%)
- Consulting & Finance (${dbData.sectors.consulting}%)
- Research & Development (${dbData.sectors.research}%)

The placement cell provides training, mock interviews, and career guidance. Would you like information about specific companies or preparation tips?`,
            category: 'placements'
          }
        } else {
          return {
            text: `VIT Vellore has an excellent placement record with consistent high placement percentages:

📊 **Placement Highlights:**
- 95%+ placement rate consistently
- Packages ranging from ₹3.5 LPA to ₹75+ LPA
- 500+ companies visit annually
- Strong alumni network across global companies

🏢 **Top Recruiters Include:**
• TCS, Infosys, Wipro, Cognizant
• Amazon, Microsoft, Google, Adobe
• Morgan Stanley, Goldman Sachs
• Bajaj, TVS, Ashok Leyland
• Cisco, Intel, Qualcomm

💼 **Placement Process:**
1. Pre-placement talks and company presentations
2. Online aptitude and technical tests
3. Technical and HR interviews
4. Final selection and offer letters

The placement cell offers training programs, soft skills development, and mock interviews. Would you like specific guidance for your branch or year?`,
            category: 'placements'
          }
        }

      case 'query_courses':
        return {
          text: `VIT Vellore offers diverse undergraduate and postgraduate programs:

🎓 **Undergraduate Programs (B.Tech):**
- Computer Science & Engineering (CSE)
- Electronics & Communication Engineering (ECE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Chemical Engineering
- Biotechnology
- Information Technology (IT)
- Electrical & Electronics Engineering (EEE)
- Aerospace Engineering
- Biomedical Engineering

📚 **Specializations Available:**
- AI & Machine Learning
- Data Science & Analytics
- Cyber Security
- IoT & Embedded Systems
- Robotics & Automation

🎯 **Postgraduate Programs:**
- M.Tech in various specializations
- MBA (Full-time & Executive)
- MCA, M.Sc, M.Des
- Ph.D programs

📝 **Admission:** Through VITEEE for UG programs and specific entrance tests for PG programs.

Which program or field interests you? I can provide more detailed information!`,
          category: 'courses'
        }

      case 'query_faculty':
        return {
          text: `VIT Vellore has distinguished faculty members across all departments:

👨‍🏫 **Faculty Highlights:**
- 1800+ full-time faculty members
- 90%+ faculty with Ph.D qualifications
- Faculty from prestigious institutions (IITs, IISc, NITs)
- International faculty exchange programs

📧 **How to Contact Faculty:**
1. **Official Email:** firstname.lastname@vit.ac.in
2. **Department Offices:** Visit respective department offices
3. **Office Hours:** Most faculty have designated consultation hours
4. **VTOP Portal:** Message feature for registered students
5. **Academic Advisor:** Each student assigned a faculty advisor

🏢 **Department Contact Information:**
- CSE: cse@vit.ac.in
- ECE: ece@vit.ac.in
- ME: mech@vit.ac.in
- Civil: civil@vit.ac.in
- For other departments, check the official VIT website

📱 **Additional Resources:**
- Faculty profiles available on VIT website
- Research interests and publications listed
- Office locations in respective department blocks

Which specific department or faculty member are you looking to contact?`,
          category: 'faculty'
        }

      case 'query_events':
        if (dbData && dbData.length > 0) {
          return {
            text: `Here are the upcoming events at VIT Vellore:

📅 **Upcoming Events:**
${dbData.map((event: any) => 
  `🎯 **${event.title}**
   📍 ${event.venue}
   📅 ${new Date(event.date).toLocaleDateString()}
   ⏰ ${event.time}
   ${event.description}\n`
).join('\n')}

For more events and detailed information, check:
- VIT official website
- Student portal announcements
- Department notice boards
- WhatsApp groups and social media

Would you like information about registering for any specific event?`,
            category: 'events'
          }
        } else {
          return {
            text: `VIT Vellore hosts numerous events throughout the year:

🎊 **Major Annual Events:**
- **Riviera:** Cultural festival (February)
- **Gravitas:** Technical festival (September)
- **Milan:** Sports festival
- **VIT Model United Nations (VITMUN)**
- **Entrepreneurship events and startup competitions**

📚 **Academic Events:**
- Guest lectures by industry experts
- Research symposiums and conferences
- Workshop and training programs
- Inter-college competitions

🎭 **Cultural Activities:**
- Dance and music competitions
- Drama and theater performances
- Art exhibitions and literary meets
- International cultural exchange programs

🏆 **Sports Events:**
- Inter-hostel sports competitions
- University-level tournaments
- Fitness and wellness programs

For current events, check the VIT website, student portal, or contact the Student Activity Center (SAC).

What type of events interest you most?`,
            category: 'events'
          }
        }

      case 'query_fees':
        if (dbData && dbData.length > 0) {
          return {
            text: `📋 **Upcoming Fee Deadlines:**

${dbData.map((fee: any) => 
  `💰 **${fee.type}**
   📅 Due Date: ${new Date(fee.deadline).toLocaleDateString()}
   💵 Amount: ₹${fee.amount}
   📝 ${fee.description}\n`
).join('\n')}

💳 **Payment Methods:**
- Online payment through VIT portal
- Demand Draft in favor of "VIT University"
- Bank transfer (NEFT/RTGS)
- Payment centers on campus

⚠️ **Important Notes:**
- Late fees applicable after deadline
- Keep payment receipts for records
- Contact finance office for payment issues

Need help with payment process or have questions about specific fees?`,
            category: 'fees'
          }
        } else {
          return {
            text: `💰 **VIT Vellore Fee Structure & Payment Information:**

📋 **Types of Fees:**
- Tuition fees (varies by category and program)
- Hostel fees (₹1.8L - ₹2.5L per year)
- Mess charges (₹55,000 - ₹65,000 per year)
- Examination fees
- Library and lab fees

💳 **Payment Methods:**
1. **Online Payment:** Through VIT student portal
2. **Demand Draft:** In favor of "VIT University"
3. **Bank Transfer:** NEFT/RTGS to VIT account
4. **Cash:** At designated payment centers

📅 **Payment Schedule:**
- Usually divided into 2-3 installments per year
- Deadlines typically in July, December, and April
- Late fee charges apply after deadline

📞 **Finance Office Contact:**
- Email: finance@vit.ac.in
- Phone: 0416-2202020
- Visit: Administrative block

⚠️ **Important:** Always keep payment receipts and check your student portal for fee status.

Do you need specific information about your fee category or payment assistance?`,
            category: 'fees'
          }
        }

      case 'query_campus_navigation':
        return {
          text: `🗺️ **VIT Vellore Campus Navigation Help:**

📍 **Campus Layout:**
- **Academic Blocks:** TT (Tech Tower), SMV, SJT, CDMM
- **Hostels:** Men's hostels (A,B,C,D blocks), Women's hostels (L,M,N,P blocks)
- **Main Building:** Administrative offices, library
- **Other Facilities:** Hospital, sports complex, food courts

🚗 **Getting Around Campus:**
- **Free Shuttle Service:** Runs between hostels and academic blocks
- **Walking Paths:** Well-marked pedestrian walkways
- **Bicycle Rentals:** Available at various points
- **Auto-rickshaws:** Available inside campus

📱 **Digital Navigation:**
- **Campus Map:** Available on VIT website and mobile app
- **Google Maps:** VIT campus is mapped with major landmarks
- **VIT Mobile App:** Includes interactive campus map

🏢 **Key Locations:**
- **Main Gate:** Primary entrance with security
- **Library:** Central library in main building
- **Hospital:** 24/7 medical facility
- **SAC:** Student Activity Center for events
- **Food Courts:** Multiple dining options across campus

📍 **Future Enhancement:** Integration with Google Maps API for real-time navigation and location sharing is planned for the next version of VIT SmartBot!

Which specific location on campus are you looking for?`,
          category: 'campus'
        }

      default:
        break
    }
  }

  // Category-based responses for lower confidence or general queries
  switch (category) {
    case 'hostel':
      return {
        text: `I can help you with hostel-related information! Here are some common topics:

🏠 **Hostel Topics I can assist with:**
- Room allocation and types
- Hostel facilities and amenities
- Mess timings and food options
- Hostel rules and regulations
- Maintenance and complaint procedures
- Wi-Fi and internet connectivity
- Laundry and cleaning services

Could you be more specific about what aspect of hostel life you'd like to know about?`,
        category: 'hostel'
      }

    case 'placements':
      return {
        text: `I'm here to help with placement-related queries! Here's what I can assist you with:

💼 **Placement Topics:**
- Placement statistics and trends
- Company-wise placement data
- Preparation tips and resources
- Resume building guidance
- Interview experiences and tips
- Internship opportunities
- Alumni connections and networking

What specific aspect of placements would you like to know more about?`,
        category: 'placements'
      }

    case 'courses':
      return {
        text: `I can provide information about VIT's academic programs! Here's what I can help with:

📚 **Academic Information:**
- Course curriculum and structure
- Admission requirements and process
- Faculty and department details
- Specializations and electives
- Credit system and grading
- Academic calendar and schedules
- Research opportunities

Which program or academic topic interests you?`,
        category: 'courses'
      }

    case 'faculty':
      return {
        text: `I can help you connect with VIT faculty! Here's what I can assist with:

👨‍🏫 **Faculty Information:**
- Contact details and office hours
- Department-wise faculty lists
- Research areas and expertise
- Academic advisor information
- How to schedule meetings
- Email etiquette and communication

Which department or specific faculty information do you need?`,
        category: 'faculty'
      }

    case 'campus':
      return {
        text: `I can help you navigate VIT campus! Here's what I can assist with:

🗺️ **Campus Navigation:**
- Building locations and directions
- Transportation within campus
- Important landmarks and facilities
- Emergency contact points
- Campus maps and routes
- Accessibility information

What specific location or campus facility are you looking for?`,
        category: 'campus'
      }

    default:
      return {
        text: `Hello! I'm VIT SmartBot, your assistant for VIT Vellore. I can help you with:

🏠 **Hostel Life:** Facilities, food, accommodation
📚 **Courses:** Programs, curriculum, admissions  
💼 **Placements:** Statistics, companies, preparation
👨‍🏫 **Faculty:** Contact info, departments, advisors
🗺️ **Campus:** Navigation, facilities, locations
📅 **Events:** Upcoming events, festivals, activities
💰 **Fees:** Payment deadlines, methods, amounts

I noticed you asked: "${originalMessage}"

Could you please rephrase your question or choose from the topics above? I'm here to help make your VIT experience better!`,
        category: 'general'
      }
  }
}