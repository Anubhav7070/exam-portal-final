// VIT Vellore specific data and utilities

export interface VITData {
  departments: Department[]
  hostels: Hostel[]
  facilities: Facility[]
  contacts: Contact[]
  academicCalendar: AcademicEvent[]
}

export interface Department {
  code: string
  name: string
  fullName: string
  email: string
  phone: string
  head: string
  building: string
  specializations: string[]
}

export interface Hostel {
  name: string
  type: 'mens' | 'womens'
  blocks: string[]
  capacity: number
  facilities: string[]
  warden: string
  contact: string
}

export interface Facility {
  name: string
  type: string
  location: string
  timings: string
  contact?: string
  description: string
}

export interface Contact {
  department: string
  designation: string
  name: string
  email: string
  phone: string
  office: string
}

export interface AcademicEvent {
  title: string
  startDate: Date
  endDate: Date
  type: 'exam' | 'registration' | 'holiday' | 'festival' | 'academic'
  description: string
}

// VIT Vellore departments data
export const departments: Department[] = [
  {
    code: 'CSE',
    name: 'Computer Science',
    fullName: 'School of Computer Science and Engineering',
    email: 'cse@vit.ac.in',
    phone: '0416-2202020',
    head: 'Dr. G. Viswanathan',
    building: 'Tech Tower (TT)',
    specializations: ['AI & ML', 'Data Science', 'Cyber Security', 'Software Engineering']
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication',
    fullName: 'School of Electronics Engineering',
    email: 'ece@vit.ac.in',
    phone: '0416-2202021',
    head: 'Dr. B. Sheela Rani',
    building: 'SMV Building',
    specializations: ['VLSI Design', 'Embedded Systems', 'Communication Systems', 'Signal Processing']
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    fullName: 'School of Mechanical Engineering',
    email: 'mech@vit.ac.in',
    phone: '0416-2202022',
    head: 'Dr. R. Saravanan',
    building: 'SJT Building',
    specializations: ['Thermal Engineering', 'Manufacturing', 'Automobile', 'Mechatronics']
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    fullName: 'School of Civil Engineering',
    email: 'civil@vit.ac.in',
    phone: '0416-2202023',
    head: 'Dr. K. Ramanathan',
    building: 'CDMM Building',
    specializations: ['Structural Engineering', 'Environmental Engineering', 'Transportation', 'Geotechnical']
  }
]

// VIT Vellore hostels data
export const hostels: Hostel[] = [
  {
    name: 'A Block',
    type: 'mens',
    blocks: ['A1', 'A2', 'A3'],
    capacity: 1200,
    facilities: ['AC Rooms', 'WiFi', 'Mess', 'Recreation Room', 'Gym'],
    warden: 'Dr. Rajesh Kumar',
    contact: '9876543210'
  },
  {
    name: 'B Block',
    type: 'mens',
    blocks: ['B1', 'B2'],
    capacity: 800,
    facilities: ['Non-AC Rooms', 'WiFi', 'Mess', 'Study Room', 'TV Room'],
    warden: 'Prof. Suresh Babu',
    contact: '9876543211'
  },
  {
    name: 'L Block',
    type: 'womens',
    blocks: ['L1', 'L2', 'L3'],
    capacity: 1000,
    facilities: ['AC Rooms', 'WiFi', 'Mess', 'Recreation Room', 'Gym', 'Security'],
    warden: 'Dr. Priya Sharma',
    contact: '9876543212'
  },
  {
    name: 'M Block',
    type: 'womens',
    blocks: ['M1', 'M2'],
    capacity: 600,
    facilities: ['Non-AC Rooms', 'WiFi', 'Mess', 'Study Room', 'Common Room'],
    warden: 'Prof. Lakshmi Devi',
    contact: '9876543213'
  }
]

// Campus facilities
export const facilities: Facility[] = [
  {
    name: 'Central Library',
    type: 'Academic',
    location: 'Main Building',
    timings: '8:00 AM - 10:00 PM',
    contact: 'library@vit.ac.in',
    description: 'Multi-storey library with over 2 lakh books, digital resources, and study spaces'
  },
  {
    name: 'Student Activity Center (SAC)',
    type: 'Recreation',
    location: 'Near Main Gate',
    timings: '9:00 AM - 9:00 PM',
    contact: 'sac@vit.ac.in',
    description: 'Hub for cultural activities, events, and student organizations'
  },
  {
    name: 'Hospital',
    type: 'Medical',
    location: 'Campus Healthcare Center',
    timings: '24/7',
    contact: '0416-2202030',
    description: '24/7 medical facility with emergency care, general medicine, and specialist consultations'
  },
  {
    name: 'Sports Complex',
    type: 'Sports',
    location: 'Athletic Grounds',
    timings: '6:00 AM - 8:00 PM',
    description: 'Complete sports facility with indoor and outdoor games, gym, and fitness center'
  },
  {
    name: 'Food Court',
    type: 'Dining',
    location: 'Multiple locations',
    timings: '7:00 AM - 11:00 PM',
    description: 'Various food courts offering diverse cuisine options across campus'
  }
]

// Important contacts
export const contacts: Contact[] = [
  {
    department: 'Admissions',
    designation: 'Assistant Registrar',
    name: 'Mr. Venkatesh',
    email: 'admissions@vit.ac.in',
    phone: '0416-2202020',
    office: 'Main Building, Ground Floor'
  },
  {
    department: 'Examinations',
    designation: 'Controller of Examinations',
    name: 'Dr. Ramesh Babu',
    email: 'examinations@vit.ac.in',
    phone: '0416-2202025',
    office: 'Main Building, First Floor'
  },
  {
    department: 'Finance',
    designation: 'Finance Officer',
    name: 'Mr. Krishnan',
    email: 'finance@vit.ac.in',
    phone: '0416-2202030',
    office: 'Administrative Block'
  },
  {
    department: 'Placements',
    designation: 'Placement Officer',
    name: 'Dr. Anitha Kumari',
    email: 'placements@vit.ac.in',
    phone: '0416-2202040',
    office: 'Placement Block'
  }
]

// Utility functions

export function getDepartmentByCode(code: string): Department | undefined {
  return departments.find(dept => dept.code.toLowerCase() === code.toLowerCase())
}

export function getHostelsByType(type: 'mens' | 'womens'): Hostel[] {
  return hostels.filter(hostel => hostel.type === type)
}

export function getFacilitiesByType(type: string): Facility[] {
  return facilities.filter(facility => facility.type.toLowerCase() === type.toLowerCase())
}

export function getContactByDepartment(department: string): Contact | undefined {
  return contacts.find(contact => 
    contact.department.toLowerCase().includes(department.toLowerCase())
  )
}

// VTOP Integration placeholder (for future development)
export interface VTOPData {
  studentId: string
  semester: number
  cgpa: number
  attendancePercentage: number
  upcomingExams: any[]
  timetable: any[]
}

export async function getVTOPData(studentId: string): Promise<VTOPData | null> {
  // This is a placeholder for future VTOP integration
  // In a real implementation, this would connect to VTOP API
  console.log('VTOP Integration not yet implemented for student:', studentId)
  return null
}

// Google Maps integration for campus navigation
export interface CampusLocation {
  name: string
  coordinates: { lat: number; lng: number }
  type: 'academic' | 'hostel' | 'facility' | 'gate'
  description: string
}

export const campusLocations: CampusLocation[] = [
  {
    name: 'Main Gate',
    coordinates: { lat: 12.9692, lng: 79.1559 },
    type: 'gate',
    description: 'Primary entrance to VIT campus'
  },
  {
    name: 'Tech Tower (TT)',
    coordinates: { lat: 12.9695, lng: 79.1562 },
    type: 'academic',
    description: 'Computer Science and IT departments'
  },
  {
    name: 'Central Library',
    coordinates: { lat: 12.9690, lng: 79.1565 },
    type: 'facility',
    description: 'Main library building'
  },
  {
    name: 'A Block Hostel',
    coordinates: { lat: 12.9688, lng: 79.1555 },
    type: 'hostel',
    description: 'Men\'s hostel A block'
  },
  {
    name: 'L Block Hostel',
    coordinates: { lat: 12.9698, lng: 79.1570 },
    type: 'hostel',
    description: 'Women\'s hostel L block'
  }
]

export function findNearestLocation(userLat: number, userLng: number): CampusLocation | null {
  if (campusLocations.length === 0) return null
  
  let nearest = campusLocations[0]
  let minDistance = calculateDistance(userLat, userLng, nearest.coordinates.lat, nearest.coordinates.lng)
  
  for (const location of campusLocations) {
    const distance = calculateDistance(userLat, userLng, location.coordinates.lat, location.coordinates.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = location
    }
  }
  
  return nearest
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Generate Google Maps URL for navigation
export function generateMapsURL(from: string, to: string): string {
  const baseURL = 'https://www.google.com/maps/dir/'
  return `${baseURL}${encodeURIComponent(from)}/${encodeURIComponent(to)}`
}

export function generateCampusNavigationURL(destination: string): string {
  const vitCampus = 'VIT University, Vellore, Tamil Nadu'
  return generateMapsURL(vitCampus, `${destination}, VIT University, Vellore`)
}

// Main function to get all VIT data
export function getVITData(): VITData {
  return {
    departments,
    hostels,
    facilities,
    contacts,
    academicCalendar: [] // This could be populated from database
  }
}

// Emergency contacts
export const emergencyContacts = {
  security: '0416-2202100',
  medical: '0416-2202030',
  fire: '101',
  police: '100',
  ambulance: '108',
  campus_emergency: '0416-2202000'
}

export default {
  departments,
  hostels,
  facilities,
  contacts,
  getDepartmentByCode,
  getHostelsByType,
  getFacilitiesByType,
  getContactByDepartment,
  getVTOPData,
  findNearestLocation,
  generateMapsURL,
  generateCampusNavigationURL,
  getVITData,
  emergencyContacts
}