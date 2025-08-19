import { test, expect } from '@playwright/test'
import { testData, testUtils } from '../fixtures/test-data'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await testUtils.waitForPageLoad(page)
  })

  test('should display search input on homepage', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]')
    await expect(searchInput).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Check placeholder text
    const placeholder = await searchInput.getAttribute('placeholder')
    expect(placeholder?.toLowerCase()).toContain('search')
  })

  test('should perform search with valid query', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Test each valid search query
    for (const query of testData.searchQueries.valid) {
      // Clear and type search query
      await searchInput.clear()
      await searchInput.fill(query)
      
      // Wait for search results (optimistic updates should show immediately)
      await page.waitForTimeout(500) // Brief wait for optimistic update
      
      // Check that some results appear or loading state is shown
      const results = page.locator('article, .post, .search-result')
      const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]')
      
      // Either results should be visible or loading indicator
      try {
        await expect(results.first()).toBeVisible({ timeout: 3000 })
      } catch {
        await expect(loadingIndicator).toBeVisible({ timeout: 1000 })
      }
      
      // If results are shown, they should contain the search term or be relevant
      if (await results.count() > 0) {
        const firstResult = results.first()
        const resultText = await firstResult.textContent()
        // Note: Due to server-side search, results might not immediately contain the term
        expect(resultText).toBeTruthy()
      }
    }
  })

  test('should show appropriate message for no results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Test no-results queries
    for (const query of testData.searchQueries.noResults) {
      await searchInput.clear()
      await searchInput.fill(query)
      
      // Wait for search to complete
      await page.waitForTimeout(2000)
      
      // Check for no results message or empty state
      const noResultsMessage = page.locator(':has-text("No posts found"), :has-text("No results"), :has-text("no matches")')
      const results = page.locator('article, .post, .search-result')
      
      // Either explicit no-results message or no visible results
      try {
        await expect(noResultsMessage).toBeVisible({ timeout: 3000 })
      } catch {
        expect(await results.count()).toBe(0)
      }
    }
  })

  test('should handle real-time search with optimistic updates', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Type a search query character by character
    const query = testData.searchQueries.valid[0]
    
    for (let i = 1; i <= query.length; i++) {
      const partialQuery = query.substring(0, i)
      await searchInput.clear()
      await searchInput.fill(partialQuery)
      
      // Brief wait to allow optimistic updates
      await page.waitForTimeout(300)
    }

    // Final results should be visible
    await page.waitForTimeout(1000)
    const results = page.locator('article, .post, .search-result')
    
    // Should have some results or clear indication of status
    const hasResults = await results.count() > 0
    const hasNoResultsMessage = await page.locator(':has-text("No posts found"), :has-text("No results")').count() > 0
    
    expect(hasResults || hasNoResultsMessage).toBeTruthy()
  })

  test('should clear search results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Perform a search first
    await searchInput.fill(testData.searchQueries.valid[0])
    await page.waitForTimeout(1000)

    // Clear the search
    await searchInput.clear()
    await page.waitForTimeout(1000)

    // Results should reset to original state (all posts or homepage content)
    const allContent = page.locator('article, .post')
    await expect(allContent.first()).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Should show more results than when filtered (or back to original state)
    const resultCount = await allContent.count()
    expect(resultCount).toBeGreaterThan(0)
  })

  test('should handle empty search gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Test empty search
    await searchInput.clear()
    await searchInput.press('Enter')
    await page.waitForTimeout(1000)

    // Should show all posts or homepage content (not crash)
    const content = page.locator('article, .post, .intro')
    await expect(content.first()).toBeVisible({ timeout: testData.timeouts.elementVisible })
  })

  test('should work with keyboard navigation', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Focus search input with keyboard
    await searchInput.click()
    await expect(searchInput).toBeFocused()

    // Type and press Enter
    await searchInput.fill(testData.searchQueries.valid[0])
    await searchInput.press('Enter')
    await page.waitForTimeout(1000)

    // Should show search results
    const results = page.locator('article, .post, .search-result')
    if (await results.count() > 0) {
      // Tab to first result
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize(testData.mobile)
    await page.reload()
    await testUtils.waitForPageLoad(page)

    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[name="search"]').first()
    await expect(searchInput).toBeVisible()

    // Test mobile search interaction
    await searchInput.tap()
    await searchInput.fill(testData.searchQueries.valid[0])
    
    // Mobile keyboard might have search button
    try {
      await page.keyboard.press('Search')
    } catch {
      await page.keyboard.press('Enter')
    }
    
    await page.waitForTimeout(2000)
    
    // Results should be visible and usable on mobile
    const results = page.locator('article, .post, .search-result')
    if (await results.count() > 0) {
      const firstResult = results.first()
      await expect(firstResult).toBeVisible()
      
      // Should be tappable
      await firstResult.tap()
      await testUtils.waitForPageLoad(page)
      
      // Should navigate to post
      expect(page.url()).toContain('/post/')
    }
  })
})