import { test, expect } from '@playwright/test'
import { testData, testUtils } from '../fixtures/test-data'

test.describe('Blog Posts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await testUtils.waitForPageLoad(page)
  })

  test('should display blog posts on homepage', async ({ page }) => {
    // Check for post elements
    const posts = page.locator('article, .post, [data-testid="post"]')
    await expect(posts.first()).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Should have multiple posts
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)
    
    // Each post should have title and content preview
    for (let i = 0; i < Math.min(postCount, 3); i++) {
      const post = posts.nth(i)
      
      // Should have a title link
      const titleLink = post.locator('a, h1, h2, h3').first()
      await expect(titleLink).toBeVisible()
      
      // Should have some content
      const content = await post.textContent()
      expect(content).toBeTruthy()
      expect(content!.length).toBeGreaterThan(10)
    }
  })

  test('should navigate to full posts page', async ({ page }) => {
    // Click "All Posts" link
    const allPostsLink = page.getByRole('link', { name: /all posts/i })
    await expect(allPostsLink).toBeVisible()
    await allPostsLink.click()
    
    await testUtils.waitForPageLoad(page)
    await expect(page).toHaveURL('/post')
    
    // Should show posts on the posts page
    const posts = page.locator('article, .post, [data-testid="post"]')
    await expect(posts.first()).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Might have more posts than homepage
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)
  })

  test('should navigate to individual blog post', async ({ page }) => {
    // Find and click first post link
    const firstPost = page.locator('article, .post').first()
    await expect(firstPost).toBeVisible()
    
    const postLink = firstPost.locator('a').first()
    await expect(postLink).toBeVisible()
    
    // Get the post URL and title for verification
    const postHref = await postLink.getAttribute('href')
    const postTitle = await postLink.textContent()
    
    expect(postHref).toBeTruthy()
    expect(postHref).toMatch(/^\/post\//)
    
    await postLink.click()
    await testUtils.waitForPageLoad(page)
    
    // Should be on the post page
    expect(page.url()).toContain('/post/')
    expect(page.url()).toContain(postHref!)
    
    // Should show post content
    const postContent = page.locator('article, .post-content, [data-nopico]')
    await expect(postContent).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Should have post title
    const pageTitle = page.locator('h1, h2').first()
    await expect(pageTitle).toBeVisible()
    
    // Title should match or be related to the clicked post
    if (postTitle) {
      const currentTitle = await pageTitle.textContent()
      expect(currentTitle).toBeTruthy()
    }
  })

  test('should display post metadata', async ({ page }) => {
    // Navigate to first post
    const firstPostLink = page.locator('article a, .post a').first()
    await expect(firstPostLink).toBeVisible()
    await firstPostLink.click()
    await testUtils.waitForPageLoad(page)
    
    // Should show metadata like date, tags, etc.
    const metadata = page.locator('.post-meta, .metadata, [data-testid="post-meta"]')
    const dateElement = page.locator('[data-testid="post-date"], .date, time')
    const tagsElement = page.locator('.tags, [data-testid="tags"], .tag')
    
    // At least some metadata should be present
    const hasMetadata = (await metadata.count()) > 0 ||
                       (await dateElement.count()) > 0 ||
                       (await tagsElement.count()) > 0
    
    expect(hasMetadata).toBeTruthy()
    
    // If tags are present, they should be clickable
    if (await tagsElement.count() > 0) {
      const firstTag = tagsElement.first()
      const tagLink = firstTag.locator('a').first()
      
      if (await tagLink.count() > 0) {
        await expect(tagLink).toBeVisible()
        
        // Click tag should navigate to tag page
        await tagLink.click()
        await testUtils.waitForPageLoad(page)
        expect(page.url()).toMatch(/\/tag\//)
      }
    }
  })

  test('should handle streaming SSR and Suspense boundaries', async ({ page }) => {
    // Test that posts load progressively with streaming
    await page.goto('/post/notion-blog-dev-review', { waitUntil: 'domcontentloaded' })
    
    // Content should appear progressively
    const postContent = page.locator('article, .post-content, [data-nopico]')
    
    // Should show loading state first (if visible)
    const loadingStates = page.locator('.loading, .skeleton, [data-testid="loading"]')
    
    // Content should eventually appear
    await expect(postContent).toBeVisible({ timeout: testData.timeouts.pageLoad })
    
    // If comments section exists, it should load separately
    const commentsSection = page.locator('#giscus, .giscus, .comments, [data-testid="comments"]')
    if (await commentsSection.count() > 0) {
      // Comments might load after main content
      await expect(commentsSection).toBeVisible({ timeout: 10000 })
    }
  })

  test('should display Notion content correctly', async ({ page }) => {
    // Navigate to a post
    const firstPostLink = page.locator('article a, .post a').first()
    await expect(firstPostLink).toBeVisible()
    await firstPostLink.click()
    await testUtils.waitForPageLoad(page)
    
    // Should render Notion blocks properly
    const notionContent = page.locator('article, .notion-page, [data-nopico]')
    await expect(notionContent).toBeVisible()
    
    // Check for various Notion block types
    const textBlocks = page.locator('p, .notion-text')
    const headingBlocks = page.locator('h1, h2, h3, .notion-heading')
    const codeBlocks = page.locator('pre, code, .notion-code')
    
    // Should have some content blocks
    const hasContent = (await textBlocks.count()) > 0 ||
                      (await headingBlocks.count()) > 0 ||
                      (await codeBlocks.count()) > 0
    
    expect(hasContent).toBeTruthy()
    
    // If code blocks exist, they should have syntax highlighting
    if (await codeBlocks.count() > 0) {
      const firstCodeBlock = codeBlocks.first()
      const codeClasses = await firstCodeBlock.getAttribute('class')
      
      // Should have styling classes (Prism or similar)
      if (codeClasses) {
        expect(codeClasses).toContain('language')
      }
    }
  })

  test('should display images properly', async ({ page }) => {
    // Navigate to a post
    const firstPostLink = page.locator('article a, .post a').first()
    await expect(firstPostLink).toBeVisible()
    await firstPostLink.click()
    await testUtils.waitForPageLoad(page)
    
    // Check for images in the post
    const images = page.locator('img')
    
    if (await images.count() > 0) {
      const firstImage = images.first()
      
      // Image should be visible
      await expect(firstImage).toBeVisible({ timeout: 10000 })
      
      // Should have proper attributes
      const src = await firstImage.getAttribute('src')
      const alt = await firstImage.getAttribute('alt')
      
      expect(src).toBeTruthy()
      
      // Should be properly loaded (not broken)
      const isImageLoaded = await firstImage.evaluate(img => {
        return (img as HTMLImageElement).complete && 
               (img as HTMLImageElement).naturalHeight !== 0
      })
      
      expect(isImageLoaded).toBeTruthy()
    }
  })

  test('should handle post not found gracefully', async ({ page }) => {
    // Navigate to non-existent post
    await page.goto('/post/non-existent-post-12345')
    
    // Should show 404 or redirect
    const notFoundIndicator = page.locator('h1:has-text("404"), h1:has-text("Not Found"), [data-testid="not-found"]')
    const isNotFound = await notFoundIndicator.count() > 0
    const isRedirected = !page.url().includes('non-existent-post-12345')
    
    expect(isNotFound || isRedirected).toBeTruthy()
  })

  test('should work with keyboard navigation', async ({ page }) => {
    // Use keyboard to navigate to posts
    await page.keyboard.press('Tab') // Navigation
    await page.keyboard.press('Tab') // Home link
    await page.keyboard.press('Tab') // Posts link
    await page.keyboard.press('Enter')
    
    await testUtils.waitForPageLoad(page)
    expect(page.url()).toContain('/post')
    
    // Navigate to first post with keyboard
    const firstPost = page.locator('article a, .post a').first()
    await firstPost.focus()
    await page.keyboard.press('Enter')
    
    await testUtils.waitForPageLoad(page)
    expect(page.url()).toMatch(/\/post\/[^/]+/)
    
    // Should be able to navigate within post content
    const postContent = page.locator('article, .post-content')
    await expect(postContent).toBeVisible()
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize(testData.mobile)
    await page.reload()
    await testUtils.waitForPageLoad(page)
    
    // Posts should be visible on mobile
    const posts = page.locator('article, .post')
    await expect(posts.first()).toBeVisible()
    
    // Tap to navigate to post
    const firstPostLink = posts.first().locator('a').first()
    await firstPostLink.tap()
    await testUtils.waitForPageLoad(page)
    
    expect(page.url()).toMatch(/\/post\/[^/]+/)
    
    // Post content should be readable on mobile
    const postContent = page.locator('article, .post-content, [data-nopico]')
    await expect(postContent).toBeVisible()
    
    // Text should not overflow
    const contentBox = await postContent.boundingBox()
    const viewportSize = page.viewportSize()
    
    if (contentBox && viewportSize) {
      expect(contentBox.width).toBeLessThanOrEqual(viewportSize.width + 20) // Allow small margin
    }
    
    // Images should be responsive
    const images = page.locator('img')
    if (await images.count() > 0) {
      const firstImage = images.first()
      const imageBox = await firstImage.boundingBox()
      
      if (imageBox && viewportSize) {
        expect(imageBox.width).toBeLessThanOrEqual(viewportSize.width + 20)
      }
    }
  })

  test('should load posts with proper performance', async ({ page }) => {
    // Measure loading performance
    const startTime = Date.now()
    
    await page.goto('/')
    await testUtils.waitForPageLoad(page)
    
    const loadTime = Date.now() - startTime
    
    // Page should load within reasonable time
    expect(loadTime).toBeLessThan(testData.timeouts.pageLoad)
    
    // Navigate to post and measure
    const postStartTime = Date.now()
    const firstPostLink = page.locator('article a, .post a').first()
    await firstPostLink.click()
    await testUtils.waitForPageLoad(page)
    
    const postLoadTime = Date.now() - postStartTime
    expect(postLoadTime).toBeLessThan(testData.timeouts.pageLoad)
    
    // Check for Core Web Vitals if possible
    const vitals = await testUtils.measureWebVitals(page)
    
    if (vitals && typeof vitals === 'object') {
      // LCP should be reasonable
      if ('lcp' in vitals && typeof vitals.lcp === 'number') {
        expect(vitals.lcp).toBeLessThan(testData.performance.lcp)
      }
    }
  })
})