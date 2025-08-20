'use client'

import { PageMeta } from "@/services/notion/types"
import { useOptimistic, useDeferredValue, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useRef, useCallback, useEffect, startTransition } from "react"
import { Posts } from "./posts"
import { searchPosts } from "@/app/actions/search"
import styles from "@/styles/posts.module.scss"

interface SearchState {
  error: string | null
  posts: PageMeta[]
  query: string
}

// Enhanced search input component with form status
function SearchInput({ 
  searchFieldRef, 
  keyword, 
  onInput 
}: { 
  searchFieldRef: React.RefObject<HTMLInputElement | null>
  keyword: string
  onInput: () => void
}) {
  const { pending } = useFormStatus()
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={searchFieldRef}
        name="search"
        type="text"
        defaultValue={keyword}
        placeholder={pending ? "Searching..." : "Search posts..."}
        className={styles.searchfield}
        onInput={onInput}
        autoComplete="off"
        disabled={pending}
        style={{
          opacity: pending ? 0.7 : 1,
          cursor: pending ? 'wait' : 'text',
        }}
      />
      {pending && (
        <div 
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.9rem',
            color: 'var(--muted-color)',
          }}
        >
          <div className="spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--muted-border-color)',
            borderTop: '2px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export const ModernSearchablePosts = ({
  posts: initialPosts,
  size,
}: {
  posts: PageMeta[]
  size: number
}) => {
  const searchFieldRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const keyword = searchParams?.get('keyword') || ''
  
  // Initialize form state with server action
  const [state, formAction] = useActionState(searchPosts, {
    error: null,
    posts: initialPosts,
    query: keyword,
  })

  // Defer the search query for better performance during rapid typing
  const deferredQuery = useDeferredValue(state.query)

  // Use optimistic updates for instant feedback
  const [optimisticState, addOptimisticUpdate] = useOptimistic(
    state,
    (currentState: SearchState, optimisticQuery: string) => ({
      ...currentState,
      query: optimisticQuery,
      // Use deferred value for expensive filtering to avoid blocking UI updates
      posts: optimisticQuery.trim() 
        ? initialPosts.filter(post => 
            post.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(deferredQuery.toLowerCase())
          )
        : initialPosts,
    })
  )

  // Update URL when search changes
  const updateURL = useCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (searchTerm) {
      params.set('keyword', searchTerm)
    } else {
      params.delete('keyword')
    }
    params.delete('page') // Reset page when searching
    
    const newUrl = `${pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [router, searchParams, pathname])

  // Handle search input with debouncing
  const handleSearch = useCallback(() => {
    const searchTerm = searchFieldRef.current?.value || ''
    
    startTransition(() => {
      // Optimistic update for instant feedback
      addOptimisticUpdate(searchTerm)
      
      // Update URL
      updateURL(searchTerm)
      
      // Submit form to server action
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        formAction(formData)
      }
    })
  }, [addOptimisticUpdate, updateURL, formAction])

  // Debounced search
  const debouncedSearch = useCallback(() => {
    const timeoutId = setTimeout(handleSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [handleSearch])

  // Initialize search field with URL parameter
  useEffect(() => {
    if (searchFieldRef.current && keyword !== optimisticState.query) {
      searchFieldRef.current.value = keyword
    }
  }, [keyword, optimisticState.query])

  return (
    <>
      {/* Search form with server action */}
      <form 
        ref={formRef}
        action={formAction}
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <SearchInput
          searchFieldRef={searchFieldRef}
          keyword={keyword}
          onInput={debouncedSearch}
        />
        
        {/* Hidden submit button for accessibility */}
        <button type="submit" style={{ display: 'none' }} aria-hidden="true">
          Search
        </button>
      </form>

      {/* Show search status */}
      {optimisticState.error && (
        <div className="search-error" style={{ color: 'var(--del-color)', marginBottom: '1rem' }}>
          {optimisticState.error}
        </div>
      )}
      
      {optimisticState.query && (
        <div className="search-status" style={{ 
          color: 'var(--muted-color)', 
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {optimisticState.posts.length} result{optimisticState.posts.length !== 1 ? 's' : ''} 
          {optimisticState.query && ` for "${optimisticState.query}"`}
          {state.query !== deferredQuery && (
            <span style={{ 
              marginLeft: '0.5rem', 
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontStyle: 'italic'
            }}>
              (optimizing...)
            </span>
          )}
        </div>
      )}

      {/* Display posts with pagination */}
      <Posts posts={optimisticState.posts} size={size} />
    </>
  )
}