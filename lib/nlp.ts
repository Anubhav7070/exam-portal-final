import natural from 'natural'

// Initialize tokenizer and stemmer
const tokenizer = new natural.WordTokenizer()
const stemmer = natural.PorterStemmer

// Define intent patterns and keywords
const intentPatterns = {
  query_hostel_facilities: {
    keywords: ['hostel', 'room', 'accommodation', 'mess', 'food', 'facility', 'facilities', 'dining', 'wifi', 'laundry', 'gym'],
    patterns: [
      /hostel.*(facilities|amenities|services)/i,
      /room.*(types|sharing|allocation)/i,
      /mess.*(timing|food|menu)/i,
      /(wifi|internet).*(hostel|room)/i,
      /(laundry|washing).*(service|facility)/i
    ],
    weight: 1.0
  },
  
  query_placements: {
    keywords: ['placement', 'job', 'company', 'recruit', 'salary', 'package', 'interview', 'career', 'statistics', 'stats'],
    patterns: [
      /placement.*(statistics|stats|data|record)/i,
      /(highest|average|minimum).*(package|salary)/i,
      /companies?.*(visiting|recruited|hiring)/i,
      /(job|career).*(opportunities|prospects)/i,
      /interview.*(preparation|tips|process)/i,
      /tell.*about.*placement/i,
      /placement.*information/i
    ],
    weight: 1.0
  },
  
  query_courses: {
    keywords: ['course', 'program', 'degree', 'curriculum', 'subject', 'branch', 'engineering', 'admission'],
    patterns: [
      /(course|program).*(available|offered)/i,
      /(curriculum|syllabus).*(structure|content)/i,
      /(admission|eligibility).*(criteria|requirement)/i,
      /(branch|specialization).*(available|offered)/i,
      /(btech|mtech|mba|phd).*(program|course)/i
    ],
    weight: 1.0
  },
  
  query_faculty: {
    keywords: ['faculty', 'professor', 'teacher', 'staff', 'contact', 'email', 'office', 'advisor'],
    patterns: [
      /faculty.*(contact|email|phone)/i,
      /(professor|teacher).*(contact|information)/i,
      /how.*(contact|reach).*(faculty|professor)/i,
      /(office|consultation).*(hours|timing)/i,
      /(academic|faculty).*(advisor|mentor)/i
    ],
    weight: 1.0
  },
  
  query_events: {
    keywords: ['event', 'festival', 'competition', 'workshop', 'seminar', 'riviera', 'gravitas'],
    patterns: [
      /(upcoming|future).*(events|festivals)/i,
      /(cultural|technical).*(fest|festival)/i,
      /(workshop|seminar|competition).*(upcoming|available)/i,
      /(riviera|gravitas).*(festival|event)/i,
      /events?.*(calendar|schedule)/i
    ],
    weight: 1.0
  },
  
  query_fees: {
    keywords: ['fee', 'payment', 'deadline', 'money', 'cost', 'expense', 'tuition'],
    patterns: [
      /fee.*(deadline|payment|due)/i,
      /(tuition|hostel|mess).*(fee|cost)/i,
      /payment.*(method|process|deadline)/i,
      /fee.*(structure|breakdown)/i,
      /(late|penalty).*(fee|charge)/i
    ],
    weight: 1.0
  },
  
  query_campus_navigation: {
    keywords: ['campus', 'location', 'direction', 'navigate', 'map', 'building', 'block'],
    patterns: [
      /(campus|college).*(map|navigation)/i,
      /(direction|location).*(building|block)/i,
      /how.*(reach|find).*(building|location)/i,
      /(shuttle|transport).*(campus|college)/i,
      /(academic|hostel).*(block|building)/i
    ],
    weight: 1.0
  }
}

// Category mapping
const categoryMapping = {
  query_hostel_facilities: 'hostel',
  query_placements: 'placements',
  query_courses: 'courses',
  query_faculty: 'faculty',
  query_events: 'events',
  query_fees: 'fees',
  query_campus_navigation: 'campus'
}

// Entity extraction patterns
const entityPatterns = {
  department: /\b(cse|ece|me|civil|chemical|biotech|it|eee|aerospace|biomedical)\b/i,
  year: /\b(first|second|third|fourth|1st|2nd|3rd|4th|final)\s*(year|semester)\b/i,
  amount: /₹\s*(\d+(?:,\d+)*(?:\.\d+)?)|(\d+(?:,\d+)*(?:\.\d+)?)\s*(lpa|lakhs?|thousands?)/i,
  date: /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4})\b/i
}

export interface NLPResult {
  intent: string
  category: string
  confidence: number
  entities: { [key: string]: string[] }
  tokens: string[]
  keywords: string[]
}

export function processNaturalLanguage(message: string): NLPResult {
  // Tokenize the message
  const tokens = tokenizer.tokenize(message.toLowerCase()) || []
  const stemmedTokens = tokens.map(token => stemmer.stem(token))
  
  // Extract entities
  const entities = extractEntities(message)
  
  // Calculate intent scores
  const intentScores: { [key: string]: number } = {}
  
  for (const [intent, config] of Object.entries(intentPatterns)) {
    let score = 0
    
    // Keyword matching
    const keywordMatches = config.keywords.filter(keyword => 
      tokens.some(token => token.includes(keyword) || keyword.includes(token))
    )
    score += keywordMatches.length * 0.3
    
    // Pattern matching
    const patternMatches = config.patterns.filter(pattern => pattern.test(message))
    score += patternMatches.length * 0.5
    
    // Stemmed keyword matching
    const stemmedKeywords = config.keywords.map(keyword => stemmer.stem(keyword))
    const stemmedMatches = stemmedKeywords.filter(stemmedKeyword =>
      stemmedTokens.includes(stemmedKeyword)
    )
    score += stemmedMatches.length * 0.2
    
    // Apply weight
    score *= config.weight
    
    intentScores[intent] = score
  }
  
  // Find the best intent
  const bestIntent = Object.keys(intentScores).reduce((a, b) => 
    intentScores[a] > intentScores[b] ? a : b
  )
  
  const confidence = Math.min(intentScores[bestIntent] / tokens.length, 1.0)
  const category = categoryMapping[bestIntent as keyof typeof categoryMapping] || 'general'
  
  // Extract keywords that were found
  const foundKeywords: string[] = []
  for (const config of Object.values(intentPatterns)) {
    foundKeywords.push(...config.keywords.filter(keyword => 
      tokens.some(token => token.includes(keyword) || keyword.includes(token))
    ))
  }
  
  return {
    intent: confidence > 0.3 ? bestIntent : 'general_query',
    category,
    confidence,
    entities,
    tokens,
    keywords: [...new Set(foundKeywords)] // Remove duplicates
  }
}

function extractEntities(message: string): { [key: string]: string[] } {
  const entities: { [key: string]: string[] } = {}
  
  for (const [entityType, pattern] of Object.entries(entityPatterns)) {
    const matches = message.match(new RegExp(pattern, 'gi'))
    if (matches) {
      entities[entityType] = matches.map(match => match.trim())
    }
  }
  
  return entities
}

// Utility function to get intent suggestions based on partial input
export function getIntentSuggestions(partialMessage: string): string[] {
  const tokens = tokenizer.tokenize(partialMessage.toLowerCase()) || []
  const suggestions: string[] = []
  
  for (const [intent, config] of Object.entries(intentPatterns)) {
    const hasRelevantKeywords = config.keywords.some(keyword =>
      tokens.some(token => keyword.includes(token) && token.length > 2)
    )
    
    if (hasRelevantKeywords) {
      suggestions.push(intent)
    }
  }
  
  return suggestions
}

// Utility function to improve intent recognition over time
export function trainFromFeedback(message: string, correctIntent: string, userFeedback: 'positive' | 'negative') {
  // This could be expanded to implement machine learning
  // For now, we'll just log the feedback for future improvements
  console.log('Training feedback:', { message, correctIntent, userFeedback })
  
  // In a production environment, you might:
  // 1. Store this feedback in a database
  // 2. Use it to retrain your NLP model
  // 3. Adjust keyword weights based on feedback
  // 4. Implement a more sophisticated ML approach
}

// Utility function to calculate similarity between messages
export function calculateSimilarity(message1: string, message2: string): number {
  const tokens1 = tokenizer.tokenize(message1.toLowerCase()) || []
  const tokens2 = tokenizer.tokenize(message2.toLowerCase()) || []
  
  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)
  
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size // Jaccard similarity
}

export default {
  processNaturalLanguage,
  getIntentSuggestions,
  trainFromFeedback,
  calculateSimilarity
}