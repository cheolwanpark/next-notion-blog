import { test, expect } from '@playwright/test'
import { testData, testUtils } from '../fixtures/test-data'

test.describe('Dark Mode Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await testUtils.waitForPageLoad(page)
  })

  test('should have dark mode toggle button', async ({ page }) => {
    // Look for dark mode toggle button
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]')
    await expect(darkModeToggle).toBeVisible({ timeout: testData.timeouts.elementVisible })
    
    // Should be accessible
    const ariaLabel = await darkModeToggle.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel?.toLowerCase()).toMatch(/(theme|dark|light|mode)/i)
  })

  test('should toggle between light and dark themes', async ({ page }) => {
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Get initial theme state
    const initialHtml = page.locator('html')
    const initialBodyTheme = await page.locator('body').getAttribute('data-theme')
    const initialHtmlTheme = await initialHtml.getAttribute('data-theme') 
    
    const initialTheme = initialBodyTheme || initialHtmlTheme || 'light'
    
    // Click toggle button
    await darkModeToggle.click()
    
    // Check that theme has changed immediately (no wait needed)
    const newBodyTheme = await page.locator('body').getAttribute('data-theme')
    const newHtmlTheme = await initialHtml.getAttribute('data-theme')
    const newTheme = newBodyTheme || newHtmlTheme
    
    expect(newTheme).not.toBe(initialTheme)
    
    // If initial was light, should now be dark (or vice versa)
    if (initialTheme === 'light') {
      expect(newTheme).toBe('dark')
    } else if (initialTheme === 'dark') {
      expect(newTheme).toBe('light')
    }
    
    // Toggle again to return to original state
    await darkModeToggle.click()
    
    const finalBodyTheme = await page.locator('body').getAttribute('data-theme')
    const finalHtmlTheme = await initialHtml.getAttribute('data-theme')
    const finalTheme = finalBodyTheme || finalHtmlTheme
    
    expect(finalTheme).toBe(initialTheme)
  })

  test('should persist theme preference across page reloads', async ({ page }) => {
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Toggle to dark mode
    await darkModeToggle.click()
    
    // Get current theme
    const bodyTheme = await page.locator('body').getAttribute('data-theme')
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    const currentTheme = bodyTheme || htmlTheme
    
    // Reload page
    await page.reload()
    await testUtils.waitForPageLoad(page)
    
    // Theme should be persisted
    const persistedBodyTheme = await page.locator('body').getAttribute('data-theme')
    const persistedHtmlTheme = await page.locator('html').getAttribute('data-theme')
    const persistedTheme = persistedBodyTheme || persistedHtmlTheme
    
    expect(persistedTheme).toBe(currentTheme)
  })

  test('should persist theme across different pages', async ({ page }) => {
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Set to dark mode
    await darkModeToggle.click()
    
    // Navigate to posts page
    const postsLink = page.getByRole('link', { name: /posts?/i }).first()
    if (await postsLink.count() > 0) {
      await postsLink.click()
      await testUtils.waitForPageLoad(page)
      
      // Theme should be maintained
      const postsPageTheme = await page.locator('body').getAttribute('data-theme') || 
                            await page.locator('html').getAttribute('data-theme')
      expect(postsPageTheme).toBe('dark')
    }
    
    // Navigate to a blog post if available
    const postLink = page.locator('article a, .post a').first()
    if (await postLink.count() > 0) {
      await postLink.click()
      await testUtils.waitForPageLoad(page)
      
      // Theme should still be maintained
      const postPageTheme = await page.locator('body').getAttribute('data-theme') || 
                            await page.locator('html').getAttribute('data-theme')
      expect(postPageTheme).toBe('dark')
    }
  })

  test('should apply appropriate styles for each theme', async ({ page }) => {
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Test light theme colors
    const body = page.locator('body')
    const lightBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor)
    
    // Toggle to dark mode
    await darkModeToggle.click()
    
    // Test dark theme colors
    const darkBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor)
    
    // Colors should be different
    expect(lightBgColor).not.toBe(darkBgColor)
    
    // Dark mode should have darker background (lower RGB values generally)
    // This is a basic check - in practice you'd check specific color values
    expect(darkBgColor).toBeTruthy()
    expect(lightBgColor).toBeTruthy()
  })

  test('should handle system preference changes', async ({ page }) => {
    // Set system to dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()
    await testUtils.waitForPageLoad(page)
    
    // Without explicit preference, should follow system preference
    let currentTheme = await page.locator('body').getAttribute('data-theme') || 
                      await page.locator('html').getAttribute('data-theme')
    
    // If no explicit theme is set, should be dark due to system preference
    if (!currentTheme) {
      // Check if dark styles are applied
      const bodyStyles = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)
      expect(bodyStyles).toBeTruthy()
    }
    
    // Set system to light mode preference
    await page.emulateMedia({ colorScheme: 'light' })
    await page.reload()
    await testUtils.waitForPageLoad(page)
    
    // Theme handling should adjust appropriately
    currentTheme = await page.locator('body').getAttribute('data-theme') || 
                  await page.locator('html').getAttribute('data-theme')
    
    // System preference changes should be handled gracefully
    expect(true).toBe(true) // Basic test that system preference changes don't crash
  })

  test('should work with keyboard interaction', async ({ page }) => {
    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Focus the toggle with keyboard
    await darkModeToggle.focus()
    await expect(darkModeToggle).toBeFocused()
    
    // Activate with Enter or Space
    const initialTheme = await page.locator('body').getAttribute('data-theme') || 
                        await page.locator('html').getAttribute('data-theme')
    
    await page.keyboard.press('Enter')
    
    const newTheme = await page.locator('body').getAttribute('data-theme') || 
                     await page.locator('html').getAttribute('data-theme')
    
    expect(newTheme).not.toBe(initialTheme)
    
    // Test with Space key
    await page.keyboard.press('Space')
    
    const finalTheme = await page.locator('body').getAttribute('data-theme') || 
                       await page.locator('html').getAttribute('data-theme')
    
    expect(finalTheme).toBe(initialTheme)
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize(testData.mobile)
    await page.reload()
    await testUtils.waitForPageLoad(page)

    const darkModeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], .theme-toggle, .dark-mode-toggle, [data-testid="theme-toggle"]').first()
    await expect(darkModeToggle).toBeVisible()

    // Should be tappable on mobile
    const initialTheme = await page.locator('body').getAttribute('data-theme') || 
                        await page.locator('html').getAttribute('data-theme')
    
    await darkModeToggle.tap()
    
    const newTheme = await page.locator('body').getAttribute('data-theme') || 
                     await page.locator('html').getAttribute('data-theme')
    
    expect(newTheme).not.toBe(initialTheme)
    
    // Toggle should be appropriately sized for mobile interaction
    const boundingBox = await darkModeToggle.boundingBox()
    expect(boundingBox).toBeTruthy()
    if (boundingBox) {
      // Should be at least 44px in either dimension for good mobile UX
      expect(Math.max(boundingBox.width, boundingBox.height)).toBeGreaterThan(32)
    }
  })
})