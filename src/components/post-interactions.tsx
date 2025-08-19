'use client'

import { useOptimistic, startTransition, useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { BsHeart, BsHeartFill, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { toggleLike, toggleBookmark } from '@/app/actions/interactions'

interface InteractionState {
  success: boolean
  error: string | null
  liked?: boolean
  bookmarked?: boolean
  postId: string
}

interface PostInteractionsProps {
  postId: string
  initialLiked?: boolean
  initialBookmarked?: boolean
}

function InteractionButton({ 
  icon: Icon, 
  activeIcon: ActiveIcon, 
  isActive, 
  label, 
  activeLabel 
}: {
  icon: any
  activeIcon: any
  isActive: boolean
  label: string
  activeLabel: string
}) {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={isActive ? activeLabel : label}
      style={{
        background: 'none',
        border: 'none',
        cursor: pending ? 'wait' : 'pointer',
        color: isActive ? 'var(--primary)' : 'var(--muted-color)',
        fontSize: '1.2rem',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        transition: 'all 0.2s ease',
        opacity: pending ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
      onMouseEnter={(e) => {
        if (!pending) {
          e.currentTarget.style.background = 'var(--card-background-color)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none'
      }}
    >
      {isActive ? <ActiveIcon /> : <Icon />}
      {pending && (
        <div
          style={{
            width: '12px',
            height: '12px',
            border: '1px solid var(--muted-border-color)',
            borderTop: '1px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginLeft: '0.25rem',
          }}
        />
      )}
    </button>
  )
}

export function PostInteractions({ 
  postId, 
  initialLiked = false, 
  initialBookmarked = false 
}: PostInteractionsProps) {
  // Form states for like and bookmark actions
  const [likeState, likeAction] = useActionState(toggleLike, {
    success: true,
    error: null,
    liked: initialLiked,
    postId,
  })

  const [bookmarkState, bookmarkAction] = useActionState(toggleBookmark, {
    success: true,
    error: null,
    bookmarked: initialBookmarked,
    postId,
  })

  // Optimistic updates for instant feedback
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(
    likeState.liked ?? initialLiked,
    (current: boolean) => !current
  )

  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    bookmarkState.bookmarked ?? initialBookmarked,
    (current: boolean) => !current
  )

  // Local storage sync for persistence across sessions
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
    // Sync with localStorage on client side
    const storedInteractions = localStorage.getItem(`post-interactions-${postId}`)
    if (storedInteractions) {
      try {
        const parsed = JSON.parse(storedInteractions)
        // Update local state if different from server state
        if (parsed.liked !== initialLiked || parsed.bookmarked !== initialBookmarked) {
          // In a real app, you might want to sync with server here
        }
      } catch (error) {
        console.error('Failed to parse stored interactions:', error)
      }
    }
  }, [postId, initialLiked, initialBookmarked])

  // Update localStorage when interactions change
  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(`post-interactions-${postId}`, JSON.stringify({
        liked: optimisticLiked,
        bookmarked: optimisticBookmarked,
        timestamp: Date.now(),
      }))
    }
  }, [postId, optimisticLiked, optimisticBookmarked, hasHydrated])

  // Handle like submission with optimistic updates
  const handleLike = (formData: FormData) => {
    startTransition(() => {
      setOptimisticLiked(optimisticLiked)
      likeAction(formData)
    })
  }

  // Handle bookmark submission with optimistic updates
  const handleBookmark = (formData: FormData) => {
    startTransition(() => {
      setOptimisticBookmarked(optimisticBookmarked)
      bookmarkAction(formData)
    })
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '1rem 0',
      padding: '0.5rem 0',
      borderTop: '1px solid var(--muted-border-color)',
    }}>
      {/* Like Button */}
      <form action={handleLike}>
        <input type="hidden" name="postId" value={postId} />
        <InteractionButton
          icon={BsHeart}
          activeIcon={BsHeartFill}
          isActive={optimisticLiked}
          label="Like this post"
          activeLabel="Unlike this post"
        />
      </form>

      {/* Bookmark Button */}
      <form action={handleBookmark}>
        <input type="hidden" name="postId" value={postId} />
        <InteractionButton
          icon={BsBookmark}
          activeIcon={BsBookmarkFill}
          isActive={optimisticBookmarked}
          label="Bookmark this post"
          activeLabel="Remove bookmark"
        />
      </form>

      {/* Error display */}
      {(likeState.error || bookmarkState.error) && (
        <div style={{
          color: 'var(--del-color)',
          fontSize: '0.8rem',
          marginLeft: 'auto',
        }}>
          {likeState.error || bookmarkState.error}
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}