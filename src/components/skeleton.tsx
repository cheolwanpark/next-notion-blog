'use client'

import { CSSProperties, ReactNode } from 'react'

// Unified skeleton animation CSS (injected once)
const SKELETON_STYLES = `
  @keyframes skeleton-pulse {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`

// Inject styles once globally
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = SKELETON_STYLES
    document.head.appendChild(style)
  }
}

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  animation?: boolean
  delay?: number
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

/**
 * Base skeleton component for consistent loading states
 */
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  animation = true,
  delay = 0,
  style = {},
  className = '',
  children,
}: SkeletonProps) => {
  const skeletonStyle: CSSProperties = {
    width,
    height,
    backgroundColor: 'var(--muted-border-color)',
    borderRadius,
    ...(animation && {
      animation: `skeleton-pulse 1.5s ease-in-out infinite alternate`,
      animationDelay: `${delay}s`,
    }),
    ...style,
  }

  return (
    <div className={className} style={skeletonStyle}>
      {children}
    </div>
  )
}

/**
 * Container for skeleton groups with consistent spacing
 */
export const SkeletonContainer = ({
  children,
  className = '',
  style = {},
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) => {
  return (
    <div className={`skeleton-container ${className}`} style={style}>
      {children}
    </div>
  )
}

/**
 * Skeleton for text lines with natural variations
 */
export const SkeletonText = ({
  lines = 1,
  widths = ['100%'],
  height = '1rem',
  gap = '0.75rem',
  delay = 0,
}: {
  lines?: number
  widths?: (string | number)[]
  height?: string | number
  gap?: string | number
  delay?: number
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={widths[i % widths.length] || '100%'}
          height={height}
          delay={delay + i * 0.1}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for tag-like elements
 */
export const SkeletonTags = ({
  count = 3,
  minWidth = 40,
  maxWidth = 80,
  height = '1rem',
  gap = '0.5rem',
  delay = 0,
}: {
  count?: number
  minWidth?: number
  maxWidth?: number
  height?: string | number
  gap?: string | number
  delay?: number
}) => {
  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          width={Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth}
          height={height}
          borderRadius="12px"
          delay={delay + i * 0.05}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for card-like content
 */
export const SkeletonCard = ({
  title = true,
  description = 2,
  image = false,
  tags = 0,
  meta = true,
  delay = 0,
}: {
  title?: boolean
  description?: number
  image?: boolean
  tags?: number
  meta?: boolean
  delay?: number
}) => {
  let currentDelay = delay

  return (
    <SkeletonContainer style={{ marginBottom: '1rem' }}>
      {/* Image */}
      {image && (
        <Skeleton
          height="150px"
          borderRadius="8px"
          delay={currentDelay}
          style={{ marginBottom: '1rem' }}
        />
      )}
      {currentDelay += 0.1}

      {/* Title */}
      {title && (
        <Skeleton
          height="1.5rem"
          width="85%"
          delay={currentDelay}
          style={{ marginBottom: '0.5rem' }}
        />
      )}
      {currentDelay += 0.1}

      {/* Description lines */}
      {description > 0 && (
        <SkeletonText
          lines={description}
          widths={['95%', '80%']}
          delay={currentDelay}
          gap="0.5rem"
        />
      )}
      {currentDelay += description * 0.1}

      {/* Tags */}
      {tags > 0 && (
        <div style={{ margin: '1rem 0 0.5rem 0' }}>
          <SkeletonTags count={tags} delay={currentDelay} />
        </div>
      )}
      {currentDelay += tags * 0.05}

      {/* Meta info */}
      {meta && (
        <Skeleton
          height="0.875rem"
          width="60%"
          delay={currentDelay}
          style={{ marginTop: '0.5rem' }}
        />
      )}
    </SkeletonContainer>
  )
}