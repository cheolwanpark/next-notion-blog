'use server'

import { revalidatePath } from 'next/cache'

export interface PostInteraction {
  postId: string
  liked: boolean
  bookmarked: boolean
  timestamp: number
}

// Simulated database - in production, this would be a real database
const interactions = new Map<string, PostInteraction>()

/**
 * Server Action to toggle like status for a post
 */
export async function toggleLike(prevState: any, formData: FormData) {
  try {
    const postId = formData.get('postId') as string
    
    if (!postId) {
      return {
        success: false,
        error: 'Post ID is required',
        liked: false,
        postId: '',
      }
    }

    // Get current interaction or create new one
    const currentInteraction = interactions.get(postId) || {
      postId,
      liked: false,
      bookmarked: false,
      timestamp: Date.now(),
    }

    // Toggle like status
    const newLiked = !currentInteraction.liked
    const updatedInteraction: PostInteraction = {
      ...currentInteraction,
      liked: newLiked,
      timestamp: Date.now(),
    }

    // Save to simulated database
    interactions.set(postId, updatedInteraction)

    // In production, you might want to revalidate specific paths
    // revalidatePath(`/post/${postSlug}`)

    return {
      success: true,
      error: null,
      liked: newLiked,
      postId,
    }
  } catch (error) {
    console.error('Toggle like error:', error)
    return {
      success: false,
      error: 'Failed to toggle like',
      liked: false,
      postId: '',
    }
  }
}

/**
 * Server Action to toggle bookmark status for a post
 */
export async function toggleBookmark(prevState: any, formData: FormData) {
  try {
    const postId = formData.get('postId') as string
    
    if (!postId) {
      return {
        success: false,
        error: 'Post ID is required',
        bookmarked: false,
        postId: '',
      }
    }

    // Get current interaction or create new one
    const currentInteraction = interactions.get(postId) || {
      postId,
      liked: false,
      bookmarked: false,
      timestamp: Date.now(),
    }

    // Toggle bookmark status
    const newBookmarked = !currentInteraction.bookmarked
    const updatedInteraction: PostInteraction = {
      ...currentInteraction,
      bookmarked: newBookmarked,
      timestamp: Date.now(),
    }

    // Save to simulated database
    interactions.set(postId, updatedInteraction)

    return {
      success: true,
      error: null,
      bookmarked: newBookmarked,
      postId,
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error)
    return {
      success: false,
      error: 'Failed to toggle bookmark',
      bookmarked: false,
      postId: '',
    }
  }
}

/**
 * Get interaction data for a post
 */
export async function getPostInteraction(postId: string): Promise<PostInteraction | null> {
  try {
    return interactions.get(postId) || null
  } catch (error) {
    console.error('Get post interaction error:', error)
    return null
  }
}

/**
 * Get all interactions (for potential bookmarks page)
 */
export async function getAllInteractions(): Promise<PostInteraction[]> {
  try {
    return Array.from(interactions.values())
  } catch (error) {
    console.error('Get all interactions error:', error)
    return []
  }
}