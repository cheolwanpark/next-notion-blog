import { NextResponse } from 'next/server'

// Use Edge Runtime for maximum performance and global distribution
export const runtime = 'edge'

/**
 * Health check endpoint optimized for Edge Runtime
 * Provides fast response times from edge locations worldwide
 * Perfect for monitoring, load balancers, and CDN health checks
 */
export async function GET() {
  const timestamp = new Date().toISOString()
  
  return NextResponse.json({
    status: 'healthy',
    timestamp,
    runtime: 'edge',
    message: 'Blog API is running smoothly',
    version: '1.0.0',
    uptime: process.uptime?.() || 'N/A', // May not be available in edge
    performance: {
      edgeOptimized: true,
      globalDistribution: true,
      coldStartOptimized: true,
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-Edge-Runtime': 'true',
    }
  })
}

/**
 * HEAD request for lightweight health checks
 */
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-Edge-Runtime': 'true',
      'X-Timestamp': new Date().toISOString(),
    }
  })
}