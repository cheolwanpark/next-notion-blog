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
} from '@/services/cache/cached-notion'
import { PageMeta } from '@/services/notion/types'
import { BlockWithChildren } from '@/services/notion/types'
import { getRelatedPosts, getRelatedTags } from '@/services/content/relationships'
import { handleServiceOperation } from '@/services/error-handling/service-errors'

/**
 * Parallel data fetching utilities for improved performance
 */

/**
 * Fetch homepage data in parallel
 * Homepage needs: recent posts, popular tags, stats
 */
export async function getHomepageData(postsCount: number = 5) {
  return handleServiceOperation(
    async () => {
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
    },
    'getHomepageData',
    {
      posts: [],
      popularTags: [],
      stats: { totalPosts: 0, totalTags: 0, recentPostsCount: 0, lastUpdated: new Date().toISOString() }
    }
  )
}

/**
 * Fetch all posts page data in parallel
 * All posts page needs: all posts, all tags, stats
 */
export async function getAllPostsPageData() {
  return handleServiceOperation(
    async () => {
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
    },
    'getAllPostsPageData',
    {
      posts: [],
      tags: [],
      stats: { totalPosts: 0, totalTags: 0, recentPostsCount: 0, lastUpdated: new Date().toISOString() }
    }
  )
}

/**
 * Fetch post page data in parallel
 * Post page needs: post metadata, blocks, related posts by tags
 */
export async function getPostPageData(path: string) {
  return handleServiceOperation(
    async () => {
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
    },
    'getPostPageData'
  )
}


/**
 * Fetch tag page data in parallel
 * Tag page needs: posts by tag, tag stats, related tags
 */
export async function getTagPageData(tag: string) {
  return handleServiceOperation(
    async () => {
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
    },
    'getTagPageData'
  )
}


/**
 * Fetch search data in parallel
 * Search needs: all posts, popular tags, recent posts for suggestions
 */
export async function getSearchPageData() {
  return handleServiceOperation(
    async () => {
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
    },
    'getSearchPageData',
    {
      allPosts: [],
      popularTags: [],
      recentPosts: []
    }
  )
}

/**
 * Batch fetch multiple posts by paths
 */
export async function getBatchPostsData(paths: string[]) {
  return handleServiceOperation(
    async () => {
      const postPromises = paths.map(path => getCachedPost(path))
      const posts = await Promise.all(postPromises)
      
      return posts.filter(Boolean) as PageMeta[]
    },
    'getBatchPostsData',
    []
  )
}

/**
 * Fetch sitemap data in parallel
 * Sitemap needs: all posts, last modification dates
 */
export async function getSitemapData() {
  return handleServiceOperation(
    async () => {
      const [allPosts, stats] = await Promise.all([
        getCachedAllPosts(),
        getCachedPostStats(),
      ])

      return {
        posts: allPosts,
        lastModified: stats.lastUpdated,
      }
    },
    'getSitemapData',
    {
      posts: [],
      lastModified: new Date().toISOString()
    }
  )
}

/**
 * Preload critical data for better performance
 * This can be used in middleware or API routes to warm up caches
 */
export async function preloadCriticalData() {
  return handleServiceOperation(
    async () => {
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
    },
    'preloadCriticalData',
    {
      recentPosts: 0,
      popularTags: 0,
      allTags: 0,
      stats: { totalPosts: 0, totalTags: 0, recentPostsCount: 0, lastUpdated: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    }
  )
}