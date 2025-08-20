'use client'

import { useReportWebVitals } from 'next/web-vitals'

export const WebVitals = () => {
  useReportWebVitals((metric) => {
    // Log to console for development
    console.log(metric)
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
    
    // You can also send to Vercel Analytics or custom endpoint
    // Example for custom analytics:
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' }
    // })
  })
  
  return null
}