import { 
  getCachedRecentPosts, 
  getCachedPostsByTag 
} from '@/services/cache/cached-notion'
import { PageMeta } from '@/services/notion/types'
import { handleServiceOperationWithFallback } from '@/services/error-handling/service-errors'

/**
 * Content relationship algorithms for posts and tags
 */

/**
 * Get related posts based on shared tags
 */
export async function getRelatedPosts(currentPost: PageMeta, limit: number = 3): Promise<PageMeta[]> {
  if (currentPost.tags.length === 0) {
    // If no tags, return recent posts
    const recentPosts = await getCachedRecentPosts(limit + 1)
    return recentPosts.filter(post => post.id !== currentPost.id).slice(0, limit)
  }

  const result = await handleServiceOperationWithFallback(
    async () => {
      // Fetch posts for each tag in parallel
      const tagPromises = currentPost.tags.map(tag => getCachedPostsByTag(tag))
      const tagResults = await Promise.all(tagPromises)
      
      // Combine and deduplicate posts
      const allRelatedPosts = new Map<string, PageMeta>()
      
      tagResults.forEach(posts => {
        posts.forEach(post => {
          if (post.id !== currentPost.id && !allRelatedPosts.has(post.id)) {
            allRelatedPosts.set(post.id, post)
          }
        })
      })

      // Sort by publish date and return limited results
      return Array.from(allRelatedPosts.values())
        .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
        .slice(0, limit)
    },
    async () => {
      // Fallback to recent posts
      const recentPosts = await getCachedRecentPosts(limit + 1)
      return recentPosts.filter(post => post.id !== currentPost.id).slice(0, limit)
    },
    'getRelatedPosts'
  )
  
  return result ?? []
}

/**
 * Get tags that frequently appear with the current tag
 */
export function getRelatedTags(posts: PageMeta[], currentTag: string, allTags: string[], limit: number): string[] {
  const tagFrequency = new Map<string, number>()

  // Count frequency of other tags in posts that have the current tag
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag !== currentTag) {
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
      }
    })
  })

  // Sort by frequency and return top related tags
  return Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}