'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import ScrollToTopButton only when user scrolls down
const ScrollToTopButton = dynamic(
  () => import('@/components/scrolltotop').then(mod => ({ default: mod.ScrollToTopButton })),
  {
    loading: () => null, // No loading indicator needed for scroll button
    ssr: false, // This is a client-side only component
  }
)

export function DynamicScrollToTop() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 200px
      const shouldShow = window.scrollY > 200
      if (shouldShow !== showButton) {
        setShowButton(shouldShow)
      }
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check initial scroll position
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showButton])

  // Only render the component when it's needed
  if (!showButton) {
    return null
  }

  return <ScrollToTopButton />
}