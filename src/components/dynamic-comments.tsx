'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import Comments with lazy loading
const Comments = dynamic(
  () => import('@/components/comments').then(mod => ({ default: mod.Comments })),
  {
    loading: () => (
      <div style={{ 
        minHeight: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--muted-color)',
        fontSize: '0.9rem'
      }}>
        Loading comments...
      </div>
    ),
    ssr: false, // Comments don't need SSR - they load after hydration
  }
)

interface DynamicCommentsProps {
  title: string
}

export function DynamicComments({ title }: DynamicCommentsProps) {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--muted-color)',
        fontSize: '0.9rem'
      }}>
        Loading comments...
      </div>
    }>
      <Comments title={title} />
    </Suspense>
  )
}