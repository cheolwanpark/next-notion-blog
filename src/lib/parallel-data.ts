'use server'

import { 
  getCachedAllPosts, 
  getCachedRecentPosts, 
  getCachedPost, 
  getCachedBlocks, 
  getCachedAllTags, 
  getCachedPopularTags,
  getCachedPostsByTag,
  getCachedPostStats
} from './cached-notion'
import { PageMeta } from '@/services/notion/types'
import { BlockWithChildren } from '@/services/notion/types/block'

/**
 * Parallel data fetching utilities for improved performance
 */

/**
 * Fetch homepage data in parallel
 * Homepage needs: recent posts, popular tags, stats
 */
export async function getHomepageData(postsCount: number = 5) {
  const [posts, popularTags, stats] = await Promise.all([
    getCachedRecentPosts(postsCount),
    getCachedPopularTags(5), // Top 5 tags
    getCachedPostStats(),
  ])

  return {
    posts,
    popularTags,
    stats,
  }
}

/**
 * Fetch all posts page data in parallel
 * All posts page needs: all posts, all tags, stats
 */
export async function getAllPostsPageData() {
  const [posts, allTags, stats] = await Promise.all([
    getCachedAllPosts(),
    getCachedAllTags(),
    getCachedPostStats(),
  ])

  return {
    posts,
    tags: allTags,
    stats,
  }
}

/**
 * Fetch post page data in parallel
 * Post page needs: post metadata, blocks, related posts by tags
 */
export async function getPostPageData(path: string) {
  try {
    // First, get the post metadata
    const postMeta = await getCachedPost(path)
    
    if (!postMeta) {
      return null
    }

    // Fetch blocks and related posts in parallel
    const [blocks, relatedPosts] = await Promise.all([
      getCachedBlocks(postMeta.id),
      getRelatedPosts(postMeta, 3),
    ])

    return {
      meta: postMeta,
      blocks,
      relatedPosts,
    }
  } catch (error) {
    console.error('Error fetching post page data:', path, error)
    return null
  }
}

/**
 * Get related posts based on shared tags
 */
export async function getRelatedPosts(currentPost: PageMeta, limit: number = 3): Promise<PageMeta[]> {
  if (currentPost.tags.length === 0) {
    // If no tags, return recent posts
    const recentPosts = await getCachedRecentPosts(limit + 1)
    return recentPosts.filter(post => post.id !== currentPost.id).slice(0, limit)
  }

  try {
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
  } catch (error) {
    console.error('Error fetching related posts:', error)
    // Fallback to recent posts
    const recentPosts = await getCachedRecentPosts(limit + 1)
    return recentPosts.filter(post => post.id !== currentPost.id).slice(0, limit)
  }
}

/**
 * Fetch tag page data in parallel
 * Tag page needs: posts by tag, tag stats, related tags
 */
export async function getTagPageData(tag: string) {
  try {
    const [posts, allTags, stats] = await Promise.all([
      getCachedPostsByTag(tag),
      getCachedAllTags(),
      getCachedPostStats(),
    ])

    // Calculate related tags (tags that appear together with the current tag)
    const relatedTags = getRelatedTags(posts, tag, allTags, 5)

    return {
      posts,
      tag,
      relatedTags,
      stats,
      totalPosts: posts.length,
    }
  } catch (error) {
    console.error('Error fetching tag page data:', tag, error)
    return null
  }
}

/**
 * Get tags that frequently appear with the current tag
 */
function getRelatedTags(posts: PageMeta[], currentTag: string, allTags: string[], limit: number): string[] {
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

/**
 * Fetch search data in parallel
 * Search needs: all posts, popular tags, recent posts for suggestions
 */
export async function getSearchPageData() {
  const [allPosts, popularTags, recentPosts] = await Promise.all([
    getCachedAllPosts(),
    getCachedPopularTags(10),
    getCachedRecentPosts(10),
  ])

  return {
    allPosts,
    popularTags,
    recentPosts,
  }
}

/**
 * Batch fetch multiple posts by paths
 */
export async function getBatchPostsData(paths: string[]) {
  const postPromises = paths.map(path => getCachedPost(path))
  const posts = await Promise.all(postPromises)
  
  return posts.filter(Boolean) as PageMeta[]
}

/**
 * Fetch sitemap data in parallel
 * Sitemap needs: all posts, last modification dates
 */
export async function getSitemapData() {
  const [allPosts, stats] = await Promise.all([
    getCachedAllPosts(),
    getCachedPostStats(),
  ])

  return {
    posts: allPosts,
    lastModified: stats.lastUpdated,
  }
}

/**
 * Preload critical data for better performance
 * This can be used in middleware or API routes to warm up caches
 */
export async function preloadCriticalData() {
  // Preload the most important data in parallel
  const [recentPosts, popularTags, allTags, stats] = await Promise.all([
    getCachedRecentPosts(10),
    getCachedPopularTags(10),
    getCachedAllTags(),
    getCachedPostStats(),
  ])

  return {
    recentPosts: recentPosts.length,
    popularTags: popularTags.length,
    allTags: allTags.length,
    stats,
    timestamp: new Date().toISOString(),
  }
}