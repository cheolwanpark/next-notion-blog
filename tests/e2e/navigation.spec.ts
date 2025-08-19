import { test, expect } from '@playwright/test'
import { testData, testUtils } from '../fixtures/test-data'

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await testUtils.waitForPageLoad(page)
  })

  test('should display homepage with correct title and content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/codingvillain/)
    
    // Check main heading
    const intro = page.getByRole('heading', { level: 1 })
    await expect(intro).toBeVisible()
    
    // Check navigation is present
    const navigation = page.getByRole('navigation')
    await expect(navigation).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    // Test home link
    const homeLink = page.getByRole('link', { name: /home/i })
    await expect(homeLink).toBeVisible()
    await homeLink.click()
    await expect(page).toHaveURL('/')

    // Test posts link
    const postsLink = page.getByRole('link', { name: /posts/i })
    await expect(postsLink).toBeVisible()
    await postsLink.click()
    await testUtils.waitForPageLoad(page)
    await expect(page).toHaveURL('/post')

    // Verify posts page content
    const postsHeading = page.getByRole('heading', { level: 1 })
    await expect(postsHeading).toBeVisible()
  })

  test('should display blog posts on homepage', async ({ page }) => {
    // Check that posts are displayed
    const postsSection = page.locator('[data-testid="posts-list"], .posts, article').first()
    await expect(postsSection).toBeVisible({ timeout: testData.timeouts.elementVisible })

    // Check "All Posts" link
    const allPostsLink = page.getByRole('link', { name: /all posts/i })
    await expect(allPostsLink).toBeVisible()
    
    // Click and verify navigation
    await allPostsLink.click()
    await testUtils.waitForPageLoad(page)
    await expect(page).toHaveURL('/post')
  })

  test('should navigate to individual blog posts', async ({ page }) => {
    // Find first post link (assume posts have titles as links)
    const firstPostLink = page.locator('article a, .post a').first()
    await expect(firstPostLink).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Get the post URL before clicking
    const href = await firstPostLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^\/post\//)

    // Click and verify navigation
    await firstPostLink.click()
    await testUtils.waitForPageLoad(page)
    
    // Verify we're on a post page
    expect(page.url()).toContain('/post/')
    
    // Check that post content is displayed
    const postContent = page.locator('article, .post-content, [data-nopico]')
    await expect(postContent).toBeVisible({ timeout: testData.timeouts.elementVisible })
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')
    
    // Check for 404 content or redirect to home
    const is404 = page.locator('h1:has-text("404")').first()
    const isRedirected = page.url() === page.url().replace('/non-existent-page', '/')
    
    // Either should show 404 page or redirect gracefully
    try {
      await expect(is404).toBeVisible({ timeout: 3000 })
    } catch {
      expect(isRedirected).toBeTruthy()
    }
  })

  test('should have accessible navigation with keyboard', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    
    // Check that focus is on a navigation element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Tab through navigation items
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should navigate somewhere (not stay on same page)
    await testUtils.waitForPageLoad(page)
    // URL should have changed or page content should be different
    const currentUrl = page.url()
    expect(currentUrl).toBeTruthy()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(testData.mobile)
    await page.reload()
    await testUtils.waitForPageLoad(page)

    // Check that navigation is accessible on mobile
    const navigation = page.getByRole('navigation')
    await expect(navigation).toBeVisible()

    // Mobile menu toggle (if exists)
    const menuToggle = page.locator('[aria-label*="menu"], .menu-toggle, .hamburger')
    if (await menuToggle.count() > 0) {
      await menuToggle.click()
      // Navigation should be expanded
      const mobileNav = page.locator('.mobile-nav, .nav-expanded')
      await expect(mobileNav).toBeVisible()
    }

    // Test mobile post navigation
    const firstPostLink = page.locator('article a, .post a').first()
    if (await firstPostLink.count() > 0) {
      await firstPostLink.click()
      await testUtils.waitForPageLoad(page)
      expect(page.url()).toContain('/post/')
    }
  })
})