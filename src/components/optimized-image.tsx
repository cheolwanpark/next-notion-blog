'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
    onError?.()
  }

  // Generate a simple blur data URL if not provided
  const defaultBlurDataURL = 
    blurDataURL || 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'

  if (error) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}
      >
        Failed to load image
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    className,
    priority,
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: placeholder === 'blur' ? defaultBlurDataURL : undefined,
    sizes,
    onLoad: handleLoad,
    onError: handleError,
    style: {
      ...style,
      transition: 'opacity 0.3s ease',
      opacity: isLoading ? 0.7 : 1,
    },
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        alt={alt}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width!}
      height={height!}
      alt={alt}
    />
  )
}

// Hero image component with priority loading
export const HeroImage = ({ 
  src, 
  alt, 
  className,
  style 
}: { 
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority
      fill
      className={className}
      style={{
        objectFit: 'cover',
        ...style
      }}
      sizes="100vw"
      placeholder="blur"
    />
  )
}

// Post thumbnail with optimized loading
export const PostThumbnail = ({
  src,
  alt,
  width = 400,
  height = 250,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      placeholder="blur"
    />
  )
}