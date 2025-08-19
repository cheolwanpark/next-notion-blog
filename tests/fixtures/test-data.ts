/**
 * Test data fixtures for Playwright E2E tests
 */

export const testData = {
  // Search test queries
  searchQueries: {
    valid: [
      'notion',
      'blog',
      'next.js',
      'react',
    ],
    noResults: [
      'zzz-no-results-expected',
      'random-nonexistent-term-12345',
    ]
  },

  // Expected page elements
  expectedElements: {
    navigation: [
      'Home',
      'Posts',
      'About',
    ],
    homepage: {
      title: 'codingvillain',
      intro: '코딩빌런의 블로그',
    }
  },

  // Performance thresholds (Core Web Vitals)
  performance: {
    // Largest Contentful Paint (LCP) - should be under 2.5s
    lcp: 2500,
    // First Input Delay (FID) - should be under 100ms
    fid: 100,
    // Cumulative Layout Shift (CLS) - should be under 0.1
    cls: 0.1,
    // Time to First Byte (TTFB) - should be under 600ms
    ttfb: 600,
  },

  // Mobile viewport settings
  mobile: {
    width: 390,
    height: 844,
  },

  // Test timeouts
  timeouts: {
    pageLoad: 10000,
    elementVisible: 5000,
    networkIdle: 3000,
  }
} as const

// Common test utilities
export const testUtils = {
  /**
   * Wait for page to be fully loaded with network idle
   */
  waitForPageLoad: async (page: any) => {
    await page.waitForLoadState('networkidle')
    // Additional wait for any animations or hydration
    await page.waitForTimeout(1000)
  },

  /**
   * Check if element is visible and interactable
   */
  isElementReady: async (page: any, selector: string) => {
    const element = page.locator(selector)
    await element.waitFor({ state: 'visible' })
    return await element.isEnabled()
  },

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals: async (page: any) => {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {}
        
        // LCP measurement
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // FID measurement  
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.name === 'first-input-delay') {
              vitals.fid = entry.value
            }
          })
        }).observe({ entryTypes: ['first-input'] })

        // CLS measurement
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          vitals.cls = clsValue
        }).observe({ entryTypes: ['layout-shift'] })

        // TTFB measurement
        const navTiming = performance.getEntriesByType('navigation')[0] as any
        vitals.ttfb = navTiming.responseStart - navTiming.requestStart

        // Return results after a short delay to collect metrics
        setTimeout(() => resolve(vitals), 2000)
      })
    })
  }
}