'use client'

export default function PostLoading() {
  return (
    <div className="skeleton-container">
      {/* Post title skeleton */}
      <div 
        style={{
          height: '2.5rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />
      
      {/* Post metadata skeleton */}
      <div 
        style={{
          height: '1rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '4px',
          marginBottom: '2rem',
          width: '60%',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />
      
      {/* Post content skeleton */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '1rem',
            backgroundColor: 'var(--muted-border-color)',
            borderRadius: '4px',
            marginBottom: '0.75rem',
            width: i % 3 === 0 ? '80%' : i % 2 === 0 ? '95%' : '70%',
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
  )
}