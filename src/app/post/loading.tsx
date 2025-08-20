'use client'

import { Skeleton, SkeletonContainer, SkeletonCard } from "@/components/skeleton"

export default function AllPostsLoading() {
  return (
    <SkeletonContainer>
      <h1>All Posts</h1>
      
      {/* Search bar skeleton */}
      <Skeleton 
        height="2.5rem"
        style={{ marginBottom: '2rem' }}
      />
      
      {/* Post list skeleton */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '1.5rem',
              border: '1px solid var(--muted-border-color)',
              borderRadius: '8px',
            }}
          >
            <SkeletonCard
              title
              description={2}
              meta
              delay={i * 0.1 + 0.2}
            />
          </div>
        ))}
      </div>
    </SkeletonContainer>
  )
}