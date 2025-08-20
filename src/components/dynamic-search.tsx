'use client'

import dynamic from 'next/dynamic'
import { PageMeta } from "@/services/notion/types"
import { Posts } from "./posts"

// Dynamically import ModernSearchablePosts with lazy loading
const ModernSearchablePosts = dynamic(
  () => import('@/components/modern-searchable-posts').then(mod => ({ default: mod.ModernSearchablePosts })),
  {
    loading: ({ isLoading }) => (
      <div>
        <div style={{
          marginBottom: '1rem',
          height: '48px',
          backgroundColor: 'var(--card-background-color)',
          border: '1px solid var(--muted-border-color)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '12px',
          color: 'var(--muted-color)',
          fontSize: '0.9rem'
        }}>
          Loading search...
        </div>
        <Posts posts={[]} size={0} />
      </div>
    ),
    ssr: false, // Search doesn't need SSR - interactive component
  }
)

interface DynamicSearchProps {
  posts: PageMeta[]
  size: number
}

export function DynamicSearch({ posts, size }: DynamicSearchProps) {
  return <ModernSearchablePosts posts={posts} size={size} />
}