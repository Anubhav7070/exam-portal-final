import { NextRequest, NextResponse } from 'next/server'
import { initializeSampleData } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // Initialize the database with sample data
    await initializeSampleData()
    
    return NextResponse.json({
      message: 'Database initialized successfully with sample VIT data',
      status: 'success'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Database initialization endpoint',
    usage: 'Send a POST request to this endpoint to initialize the database with sample VIT data',
    note: 'This will only add data if the collections are empty'
  })
}