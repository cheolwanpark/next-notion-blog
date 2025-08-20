'use client'

import { Skeleton, SkeletonContainer, SkeletonText } from "@/components/skeleton"

export default function PostLoading() {
  return (
    <SkeletonContainer>
      {/* Post title skeleton */}
      <Skeleton 
        height="2.5rem"
        style={{ marginBottom: '1rem' }}
      />
      
      {/* Post metadata skeleton */}
      <Skeleton 
        height="1rem"
        width="60%"
        delay={0.2}
        style={{ marginBottom: '2rem' }}
      />
      
      {/* Post content skeleton */}
      <SkeletonText
        lines={8}
        widths={['95%', '80%', '70%']}
        delay={0.4}
      />
    </SkeletonContainer>
  )
}