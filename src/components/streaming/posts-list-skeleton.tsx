'use client'

import styles from "@/styles/components/posts.module.scss"
import { Skeleton, SkeletonContainer, SkeletonCard } from "@/components/skeleton"

// Loading skeleton for posts list (used in PPR)
export const PostsListSkeleton = () => {
  return (
    <SkeletonContainer className="posts-list-skeleton">
      {/* Search field skeleton */}
      <Skeleton
        height="2.5rem"
        borderRadius="6px"
        style={{ marginBottom: '2rem' }}
      />

      {/* Posts grid skeleton */}
      <section className={styles.posts}>
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className={styles.post} style={{ position: 'relative' }}>
            <SkeletonCard
              title
              description={2}
              tags={Math.floor(Math.random() * 3) + 1}
              meta
              delay={i * 0.1}
            />
          </article>
        ))}
      </section>
    </SkeletonContainer>
  )
}