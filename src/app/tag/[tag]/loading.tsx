'use client'

export default function TagLoading() {
  return (
    <div>
      {/* Tag title skeleton */}
      <div 
        style={{
          height: '2.5rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '4px',
          marginBottom: '1rem',
          width: '30%',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />
      
      {/* Search bar skeleton */}
      <div 
        style={{
          height: '2.5rem',
          backgroundColor: 'var(--muted-border-color)',
          borderRadius: '4px',
          marginBottom: '2rem',
          animation: 'pulse 1.5s ease-in-out infinite alternate'
        }}
      />
      
      {/* Post list skeleton */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '1.5rem',
              border: '1px solid var(--muted-border-color)',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite alternate',
              animationDelay: `${i * 0.1}s`
            }}
          >
            {/* Post title skeleton */}
            <div 
              style={{
                height: '1.5rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                width: '75%'
              }}
            />
            
            {/* Post summary skeleton */}
            <div 
              style={{
                height: '1rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                width: '90%'
              }}
            />
            <div 
              style={{
                height: '1rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                width: '65%'
              }}
            />
            
            {/* Post metadata skeleton */}
            <div 
              style={{
                height: '0.75rem',
                backgroundColor: 'var(--muted-border-color)',
                borderRadius: '4px',
                width: '35%'
              }}
            />
          </div>
        ))}
      </div>

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