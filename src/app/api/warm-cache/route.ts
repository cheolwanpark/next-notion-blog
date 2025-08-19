import { NextRequest, NextResponse } from 'next/server'
import { preloadCriticalData } from '@/lib/parallel-data'

// Note: Using Node.js runtime for cache warming due to heavy data operations
// Edge Runtime is better for lightweight operations
export const runtime = 'nodejs'

/**
 * API route for warming up critical caches
 * Usage: POST /api/warm-cache
 * 
 * This can be called:
 * - After deploying new content
 * - During scheduled maintenance
 * - Before expected traffic spikes
 * - As part of a CI/CD pipeline
 */
export async function POST(request: NextRequest) {
  try {
    // Optional authorization check
    const authHeader = request.headers.get('authorization')
    const validToken = process.env.CACHE_WARM_TOKEN
    
    if (validToken && authHeader !== `Bearer ${validToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting cache warm-up...')
    const startTime = Date.now()

    // Preload critical data in parallel
    const result = await preloadCriticalData()

    const duration = Date.now() - startTime

    console.log(`Cache warm-up completed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: 'Cache warmed successfully',
      duration: `${duration}ms`,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cache warm-up error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to warm cache',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check cache warming API status
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    purpose: 'Cache warming for critical data preloading',
    usage: 'POST to this endpoint to trigger cache warming',
    timestamp: new Date().toISOString(),
  })
}