import { NextResponse } from 'next/server'
import { getCachedPostStats } from '@/lib/cached-notion'

// Use Node.js runtime for cached data access
// Note: Edge Runtime has limitations with complex caching functions
export const runtime = 'nodejs'

/**
 * Blog statistics endpoint with caching
 * Serves cached statistics with database access
 */
export async function GET() {
  try {
    const stats = await getCachedPostStats()
    
    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        runtime: 'edge',
        cached: true,
        timestamp: new Date().toISOString(),
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900', // 5min cache, 15min stale
        'X-Edge-Runtime': 'true',
        'X-Cache-Tags': 'stats,metadata',
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog statistics',
      meta: {
        runtime: 'edge',
        timestamp: new Date().toISOString(),
      }
    }, { 
      status: 500,
      headers: {
        'X-Edge-Runtime': 'true',
      }
    })
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
      'X-Edge-Runtime': 'true',
    }
  })
}