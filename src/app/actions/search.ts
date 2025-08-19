'use server'

import { query } from '@/services/notion/query'
import { PageMeta } from '@/services/notion/types'
import { unstable_cache } from 'next/cache'

// Cached search function for better performance
const cachedSearch = unstable_cache(
  async (searchTerm: string): Promise<PageMeta[]> => {
    if (!searchTerm.trim()) {
      // Return all posts if no search term
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
    }

    // Get all posts and filter client-side for now
    // TODO: Implement server-side search when upgrading Notion query interface
    const response = await query({
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
      page_size: 100,
    })

    // Filter posts by search term
    return response.pages.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  },
  ['search-posts'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['search', 'posts'],
  }
)

// Server Action for searching posts
export async function searchPosts(prevState: any, formData: FormData) {
  try {
    const searchTerm = formData.get('search') as string
    
    // Validate search term
    if (typeof searchTerm !== 'string') {
      return {
        error: 'Invalid search term',
        posts: [],
        query: '',
      }
    }

    const posts = await cachedSearch(searchTerm.toLowerCase())
    
    return {
      error: null,
      posts,
      query: searchTerm,
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      error: 'Failed to search posts',
      posts: [],
      query: '',
    }
  }
}

// Server Action for getting search suggestions
export async function getSearchSuggestions(searchTerm: string): Promise<string[]> {
  try {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      return []
    }

    const posts = await cachedSearch(searchTerm.toLowerCase())
    
    // Extract unique tags and titles for suggestions
    const suggestions = new Set<string>()
    
    posts.forEach(post => {
      // Add matching titles
      if (post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(post.title)
      }
      
      // Add matching tags
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(tag)
        }
      })
    })
    
    return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
  } catch (error) {
    console.error('Error getting search suggestions:', error)
    return []
  }
}