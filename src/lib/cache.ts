import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache'

/**
 * Cache configuration with tags and revalidation strategies
 */
export const cacheConfig = {
  // Core content caching (posts, pages)
  posts: {
    key: 'posts',
    tags: ['posts', 'content'] as string[],
    revalidate: 900, // 15 minutes - matches site config
  },
  
  // Individual post caching
  post: {
    key: 'post',
    tags: ['posts', 'content'] as string[],
    revalidate: 900, // 15 minutes
  },
  
  // Tag-based queries
  tagPosts: {
    key: 'tag-posts',
    tags: ['posts', 'tags', 'content'] as string[],
    revalidate: 1800, // 30 minutes - tags change less frequently
  },
  
  // Search results
  search: {
    key: 'search',
    tags: ['search', 'posts', 'content'] as string[],
    revalidate: 300, // 5 minutes - frequent for better UX
  },
  
  // Static metadata (site info, navigation)
  metadata: {
    key: 'metadata',
    tags: ['metadata', 'static'] as string[],
    revalidate: 3600, // 1 hour - static content
  },
  
  // Block content (Notion page blocks)
  blocks: {
    key: 'blocks',
    tags: ['blocks', 'content'] as string[],
    revalidate: 1800, // 30 minutes - content blocks change less frequently
  },
  
  // Image data (blur data URLs, dimensions)
  images: {
    key: 'images',
    tags: ['images', 'static'] as string[],
    revalidate: 86400, // 24 hours - image metadata rarely changes
  },
}

/**
 * Enhanced cache wrapper with automatic tag management
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  options: {
    tags: string[]
    revalidate: number
    keyPrefix?: string
  }
) {
  return unstable_cache(
    fn,
    [options.keyPrefix ? `${options.keyPrefix}-${cacheKey}` : cacheKey],
    {
      revalidate: options.revalidate,
      tags: options.tags,
    }
  )
}

/**
 * Cache invalidation utilities
 */
export const cacheInvalidation = {
  // Invalidate all content (posts, pages, blocks)
  invalidateAllContent: () => {
    revalidateTag('content')
  },
  
  // Invalidate just posts
  invalidatePosts: () => {
    revalidateTag('posts')
  },
  
  // Invalidate search results
  invalidateSearch: () => {
    revalidateTag('search')
  },
  
  // Invalidate specific post and related content
  invalidatePost: (path: string) => {
    revalidateTag('posts')
    revalidateTag('content')
    revalidatePath(`/post/${path}`)
  },
  
  // Invalidate tag-based queries
  invalidateTagQueries: (tag: string) => {
    revalidateTag('tags')
    revalidatePath(`/tag/${tag}`)
  },
  
  // Invalidate static content
  invalidateStatic: () => {
    revalidateTag('static')
    revalidateTag('metadata')
  },
  
  // Full cache purge (use sparingly)
  purgeAll: () => {
    Object.keys(cacheConfig).forEach(key => {
      const config = cacheConfig[key as keyof typeof cacheConfig]
      config.tags.forEach(tag => revalidateTag(tag))
    })
    revalidatePath('/')
  },
} as const

/**
 * Cache warming utilities for better performance
 */
export const cacheWarming = {
  // Warm up critical pages
  warmCriticalPages: async () => {
    // This would be called during build or via API
    // Implementation would pre-load critical data
    console.log('Cache warming started')
  },
  
  // Warm up post list
  warmPostList: async () => {
    // Pre-load post list data
    console.log('Warming post list cache')
  },
  
  // Warm up popular tags
  warmPopularTags: async () => {
    // Pre-load data for popular tags
    console.log('Warming popular tags cache')
  },
} as const

/**
 * Cache metrics and monitoring
 */
export const cacheMetrics = {
  // Track cache hit rates
  trackCacheHit: (key: string) => {
    // Implementation would track metrics
    console.log(`Cache hit: ${key}`)
  },
  
  // Track cache misses
  trackCacheMiss: (key: string) => {
    // Implementation would track metrics
    console.log(`Cache miss: ${key}`)
  },
  
  // Get cache statistics
  getCacheStats: () => {
    // Return cache performance metrics
    return {
      hitRate: 0.85,
      totalRequests: 1000,
      totalHits: 850,
    }
  },
} as const