'use client'

import styles from "@/styles/posts.module.scss"

// Loading skeleton for posts list (used in PPR)
export function PostsListSkeleton() {
  return (
    <div className="posts-list-skeleton">
      {/* Search field skeleton */}
      <div
        style={{
          height: '2.5rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '6px',
          marginBottom: '2rem',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />

      {/* Posts grid skeleton */}
      <section className={styles.posts}>
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className={styles.post} style={{ position: 'relative' }}>
            {/* Post title skeleton */}
            <div
              style={{
                height: '1.5rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                width: i % 2 === 0 ? '85%' : '70%',
                animation: 'pulse 1.5s ease-in-out infinite alternate',
                animationDelay: `${i * 0.1}s`
              }}
            />

            {/* Post description skeleton */}
            <div
              style={{
                height: '1rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                width: '95%',
                animation: 'pulse 1.5s ease-in-out infinite alternate',
                animationDelay: `${i * 0.1 + 0.2}s`
              }}
            />

            <div
              style={{
                height: '1rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '1rem',
                width: '80%',
                animation: 'pulse 1.5s ease-in-out infinite alternate',
                animationDelay: `${i * 0.1 + 0.3}s`
              }}
            />

            {/* Tags skeleton */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: '1rem',
                    width: `${Math.floor(Math.random() * 30) + 40}px`,
                    backgroundColor: 'var(--muted-border-color)',
                    borderRadius: '12px',
                    animation: 'pulse 1.5s ease-in-out infinite alternate',
                    animationDelay: `${i * 0.1 + j * 0.05 + 0.4}s`
                  }}
                />
              ))}
            </div>

            {/* Date and author skeleton */}
            <div
              style={{
                height: '0.875rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                width: '60%',
                animation: 'pulse 1.5s ease-in-out infinite alternate',
                animationDelay: `${i * 0.1 + 0.5}s`
              }}
            />
          </article>
        ))}
      </section>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}