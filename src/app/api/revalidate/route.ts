import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// Use Edge Runtime for faster execution
export const runtime = 'edge'

/**
 * API route for manual cache revalidation
 * Usage: POST /api/revalidate with JSON body
 * 
 * Examples:
 * - Revalidate all posts: { "action": "posts" }
 * - Revalidate specific post: { "action": "post", "path": "my-post-slug" }
 * - Revalidate tag queries: { "action": "tag", "tag": "nextjs" }
 * - Purge all cache: { "action": "all" }
 */
export async function POST(request: NextRequest) {
  try {
    // Check for authorization (optional - add your own auth logic)
    const authHeader = request.headers.get('authorization')
    const validToken = process.env.REVALIDATION_TOKEN
    
    if (validToken && authHeader !== `Bearer ${validToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, path, tag } = body

    switch (action) {
      case 'posts':
        // Revalidate all post-related content
        revalidateTag('posts')
        revalidateTag('content')
        revalidatePath('/')
        revalidatePath('/post')
        return NextResponse.json({ 
          message: 'Posts revalidated successfully',
          timestamp: new Date().toISOString()
        })

      case 'post':
        // Revalidate specific post
        if (!path) {
          return NextResponse.json(
            { error: 'Path is required for post revalidation' },
            { status: 400 }
          )
        }
        revalidateTag('posts')
        revalidateTag('content')
        revalidatePath(`/post/${path}`)
        revalidatePath('/') // Homepage might show recent posts
        return NextResponse.json({ 
          message: `Post ${path} revalidated successfully`,
          timestamp: new Date().toISOString()
        })

      case 'tag':
        // Revalidate tag-related queries
        if (!tag) {
          return NextResponse.json(
            { error: 'Tag is required for tag revalidation' },
            { status: 400 }
          )
        }
        revalidateTag('tags')
        revalidateTag('posts')
        revalidatePath(`/tag/${tag}`)
        return NextResponse.json({ 
          message: `Tag ${tag} revalidated successfully`,
          timestamp: new Date().toISOString()
        })

      case 'search':
        // Revalidate search cache
        revalidateTag('search')
        return NextResponse.json({ 
          message: 'Search cache revalidated successfully',
          timestamp: new Date().toISOString()
        })

      case 'static':
        // Revalidate static content
        revalidateTag('static')
        revalidateTag('metadata')
        revalidatePath('/robots.txt')
        revalidatePath('/sitemap.xml')
        return NextResponse.json({ 
          message: 'Static content revalidated successfully',
          timestamp: new Date().toISOString()
        })

      case 'all':
        // Nuclear option - revalidate everything
        const tags = ['posts', 'content', 'search', 'tags', 'static', 'metadata', 'blocks', 'images']
        tags.forEach(tag => revalidateTag(tag))
        
        // Revalidate key paths
        const paths = ['/', '/post', '/robots.txt', '/sitemap.xml']
        paths.forEach(path => revalidatePath(path))
        
        return NextResponse.json({ 
          message: 'All cache revalidated successfully',
          tags,
          paths,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported: posts, post, tag, search, static, all' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check revalidation API status
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    availableActions: ['posts', 'post', 'tag', 'search', 'static', 'all'],
    examples: {
      revalidateAllPosts: {
        method: 'POST',
        body: { action: 'posts' }
      },
      revalidateSpecificPost: {
        method: 'POST', 
        body: { action: 'post', path: 'my-post-slug' }
      },
      revalidateTag: {
        method: 'POST',
        body: { action: 'tag', tag: 'nextjs' }
      },
      purgeAll: {
        method: 'POST',
        body: { action: 'all' }
      }
    }
  })
}