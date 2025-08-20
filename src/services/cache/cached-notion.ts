'use server'

import { query } from '@/services/notion/query'
import { getBlocks } from '@/services/notion/block'
import { PageMeta, QueryResult } from '@/services/notion/types'
import { BlockWithChildren } from '@/services/notion/types'
import { createCachedFunction, cacheConfig } from './cache'

/**
 * Cached version of the main query function with enhanced caching strategy
 */
export const cachedQuery = createCachedFunction(
  query,
  'notion-query',
  cacheConfig.posts
)

/**
 * Cached function to get all posts with smart caching
 */
export const getCachedAllPosts = createCachedFunction(
  async (): Promise<PageMeta[]> => {
    const response = await query({
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
      page_size: 100,
    })
    return response.pages
  },
  'all-posts',
  cacheConfig.posts
)

/**
 * Cached function to get recent posts
 */
export const getCachedRecentPosts = createCachedFunction(
  async (count: number = 5): Promise<PageMeta[]> => {
    const response = await query({
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
      page_size: count,
    })
    return response.pages
  },
  'recent-posts',
  cacheConfig.posts
)

/**
 * Cached function to get posts by tag
 */
export const getCachedPostsByTag = createCachedFunction(
  async (tag: string): Promise<PageMeta[]> => {
    const response = await query({
      query: {
        type: 'and',
        tags: [tag],
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
      page_size: 100,
    })
    return response.pages
  },
  'posts-by-tag',
  cacheConfig.tagPosts
)

/**
 * Cached function to get a single post by path
 */
export const getCachedPost = createCachedFunction(
  async (path: string): Promise<PageMeta | null> => {
    const response = await query({
      query: { path },
    })
    return response.pages.length > 0 ? response.pages[0] : null
  },
  'post-by-path',
  cacheConfig.post
)

/**
 * Cached function to get blocks for a page
 */
export const getCachedBlocks = createCachedFunction(
  async (pageId: string): Promise<BlockWithChildren[]> => {
    return await getBlocks(pageId)
  },
  'page-blocks',
  cacheConfig.blocks
)

/**
 * Cached function to get all unique tags
 */
export const getCachedAllTags = createCachedFunction(
  async (): Promise<string[]> => {
    const posts = await getCachedAllPosts()
    const allTags = posts.flatMap(post => post.tags)
    return Array.from(new Set(allTags)).sort()
  },
  'all-tags',
  cacheConfig.tagPosts
)

/**
 * Cached function to get popular tags (tags with most posts)
 */
export const getCachedPopularTags = createCachedFunction(
  async (count: number = 10): Promise<Array<{ tag: string; count: number }>> => {
    const posts = await getCachedAllPosts()
    const tagCounts = new Map<string, number>()
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, count)
  },
  'popular-tags',
  cacheConfig.tagPosts
)

/**
 * Cached function for full-text search
 */
export const getCachedSearchResults = createCachedFunction(
  async (searchTerm: string): Promise<PageMeta[]> => {
    if (!searchTerm.trim()) {
      return await getCachedAllPosts()
    }
    
    const posts = await getCachedAllPosts()
    const lowerSearchTerm = searchTerm.toLowerCase()
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerSearchTerm) ||
      post.description.toLowerCase().includes(lowerSearchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    )
  },
  'search-results',
  cacheConfig.search
)

/**
 * Cached function to get post statistics
 */
export const getCachedPostStats = createCachedFunction(
  async (): Promise<{
    totalPosts: number
    totalTags: number
    recentPostsCount: number
    lastUpdated: string
  }> => {
    const posts = await getCachedAllPosts()
    const tags = await getCachedAllTags()
    const recentPosts = posts.filter(post => {
      const publishDate = new Date(post.published)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return publishDate > thirtyDaysAgo
    })
    
    return {
      totalPosts: posts.length,
      totalTags: tags.length,
      recentPostsCount: recentPosts.length,
      lastUpdated: new Date().toISOString(),
    }
  },
  'post-stats',
  cacheConfig.metadata
)