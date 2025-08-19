'use client'

// Content-aware loading skeleton for post content
export function PostContentSkeleton() {
  return (
    <article data-nopico>
      <div className="skeleton-container">
        {/* Post title skeleton */}
        <div 
          style={{
            height: '3rem',
            backgroundColor: 'var(--muted-border-color)',
            borderRadius: '4px',
            marginBottom: '1rem',
            animation: 'pulse 1.5s ease-in-out infinite alternate'
          }}
        />
        
        {/* Post metadata skeleton */}
        <div 
          style={{
            height: '1.5rem',
            backgroundColor: 'var(--muted-border-color)',
            borderRadius: '4px',
            marginBottom: '2rem',
            width: '60%',
            animation: 'pulse 1.5s ease-in-out infinite alternate',
            animationDelay: '0.2s'
          }}
        />
        
        {/* Post cover image skeleton */}
        <div
          style={{
            height: '200px',
            backgroundColor: 'var(--muted-border-color)',
            borderRadius: '8px',
            marginBottom: '2rem',
            animation: 'pulse 1.5s ease-in-out infinite alternate',
            animationDelay: '0.4s'
          }}
        />
        
        {/* Post content skeleton - multiple paragraphs */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: i % 4 === 0 ? '2rem' : '1rem', // Larger height for headers
              backgroundColor: 'var(--muted-border-color)',
              borderRadius: '4px',
              marginBottom: i % 4 === 0 ? '1.5rem' : '0.75rem',
              width: 
                i % 4 === 0 ? '85%' : // Headers
                i % 3 === 0 ? '90%' : // Long lines
                i % 2 === 0 ? '95%' : '70%', // Varied line lengths
              animation: 'pulse 1.5s ease-in-out infinite alternate',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}

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
    </article>
  )
}

// Minimal loading skeleton for comments section
export function PostCommentsSkeleton() {
  return (
    <div className="skeleton-container">
      <div 
        style={{
          height: '2rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          width: '40%',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />
      
      {/* Comment box skeleton */}
      <div
        style={{
          height: '150px',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '8px',
          animation: 'pulse 1.5s ease-in-out infinite alternate',
          animationDelay: '0.3s'
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}