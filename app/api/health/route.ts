import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if the application is running properly
    const timestamp = new Date().toISOString()
    
    // Basic health checks
    const healthStatus = {
      status: 'healthy',
      timestamp,
      service: 'VIT SmartBot',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        api: 'operational',
        nlp: 'operational',
        database: 'checking...'
      }
    }

    // Optional: Check database connectivity
    try {
      // This is a simple check - you could expand this to actually ping MongoDB
      if (process.env.MONGODB_URI) {
        healthStatus.checks.database = 'configured'
      } else {
        healthStatus.checks.database = 'demo_mode'
      }
    } catch (error) {
      healthStatus.checks.database = 'error'
    }

    return NextResponse.json(healthStatus, { status: 200 })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'VIT SmartBot',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

export async function HEAD(request: NextRequest) {
  // Simple health check for load balancers
  return new NextResponse(null, { status: 200 })
}