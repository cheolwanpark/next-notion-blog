import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '50vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1>404 - Page Not Found</h1>
      <p style={{ marginBottom: '1rem', color: 'var(--muted-color)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Go Home
      </Link>
    </div>
  )
}