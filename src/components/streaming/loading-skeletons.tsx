'use client'

import { Skeleton, SkeletonContainer, SkeletonText } from "@/components/skeleton"

// Content-aware loading skeleton for post content
export const PostContentSkeleton = () => {
  return (
    <article data-nopico>
      <SkeletonContainer>
        {/* Post title skeleton */}
        <Skeleton 
          height="3rem"
          style={{ marginBottom: '1rem' }}
        />
        
        {/* Post metadata skeleton */}
        <Skeleton 
          height="1.5rem"
          width="60%"
          delay={0.2}
          style={{ marginBottom: '2rem' }}
        />
        
        {/* Post cover image skeleton */}
        <Skeleton
          height="200px"
          borderRadius="8px"
          delay={0.4}
          style={{ marginBottom: '2rem' }}
        />
        
        {/* Post content skeleton - headers and paragraphs */}
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: '2rem' }}>
            {/* Section header */}
            <Skeleton
              height="2rem"
              width="85%"
              delay={sectionIndex * 0.8 + 0.6}
              style={{ marginBottom: '1rem' }}
            />
            
            {/* Section paragraphs */}
            <SkeletonText
              lines={3}
              widths={['95%', '90%', '70%']}
              delay={sectionIndex * 0.8 + 0.8}
            />
          </div>
        ))}
      </SkeletonContainer>
    </article>
  )
}

// Minimal loading skeleton for comments section
export const PostCommentsSkeleton = () => {
  return (
    <SkeletonContainer>
      {/* Comments header */}
      <Skeleton
        height="2rem"
        width="40%"
        style={{ marginBottom: '1rem' }}
      />
      
      {/* Comment box skeleton */}
      <Skeleton
        height="150px"
        borderRadius="8px"
        delay={0.3}
      />
    </SkeletonContainer>
  )
}