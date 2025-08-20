/**
 * Utilities for on-demand cache revalidation
 * These functions help trigger cache updates when content changes
 */

/**
 * Client-side utility to trigger revalidation
 * Can be used in webhooks, admin interfaces, or manual triggers
 */
export async function triggerRevalidation({
  action,
  path,
  tag,
  token,
}: {
  action: 'posts' | 'post' | 'tag' | 'search' | 'static' | 'all'
  path?: string
  tag?: string
  token?: string
}) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action,
        path,
        tag,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Revalidation triggered:', result)
    return result
  } catch (error) {
    console.error('Revalidation failed:', error)
    throw error
  }
}

/**
 * Utility functions for common revalidation scenarios
 */
export const revalidationTriggers = {
  // When a new post is published
  async newPost(postPath: string, token?: string) {
    return triggerRevalidation({
      action: 'posts',
      token,
    })
  },

  // When a specific post is updated
  async updatePost(postPath: string, token?: string) {
    return triggerRevalidation({
      action: 'post',
      path: postPath,
      token,
    })
  },

  // When posts are tagged with a new tag
  async updateTag(tagName: string, token?: string) {
    return triggerRevalidation({
      action: 'tag',
      tag: tagName,
      token,
    })
  },

  // When search index needs updating
  async updateSearch(token?: string) {
    return triggerRevalidation({
      action: 'search',
      token,
    })
  },

  // When site metadata changes
  async updateStatic(token?: string) {
    return triggerRevalidation({
      action: 'static',
      token,
    })
  },

  // Nuclear option - refresh everything
  async refreshAll(token?: string) {
    return triggerRevalidation({
      action: 'all',
      token,
    })
  },
}

/**
 * Webhook handler for Notion database changes
 * This would be called from a Notion webhook if configured
 */
export async function handleNotionWebhook(
  webhookPayload: any,
  revalidationToken?: string
) {
  try {
    // Example webhook payload structure (adjust based on actual Notion webhook format)
    const { event_type, object_type, data } = webhookPayload

    switch (event_type) {
      case 'page.created':
        if (object_type === 'page') {
          console.log('New page created, revalidating posts')
          return await revalidationTriggers.newPost('', revalidationToken)
        }
        break

      case 'page.updated':
        if (object_type === 'page' && data?.path) {
          console.log(`Page updated: ${data.path}`)
          return await revalidationTriggers.updatePost(
            data.path,
            revalidationToken
          )
        }
        break

      case 'database.updated':
        console.log('Database structure changed, refreshing all caches')
        return await revalidationTriggers.refreshAll(revalidationToken)

      default:
        console.log(`Unhandled webhook event: ${event_type}`)
        return { message: 'No action taken' }
    }
  } catch (error) {
    console.error('Webhook handling failed:', error)
    throw error
  }
}

/**
 * Deployment hook handler
 * Call this after deploying new content or code changes
 */
export async function handleDeploymentComplete(token?: string) {
  try {
    console.log('Deployment completed, warming up critical caches')
    
    // First warm up the cache
    const warmResponse = await fetch('/api/warm-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!warmResponse.ok) {
      console.warn('Cache warming failed, proceeding with revalidation')
    }

    // Then trigger a full revalidation
    return await revalidationTriggers.refreshAll(token)
  } catch (error) {
    console.error('Deployment hook handling failed:', error)
    throw error
  }
}

/**
 * Scheduled maintenance handler
 * Call this periodically (e.g., via cron job) to keep caches fresh
 */
export async function handleScheduledMaintenance(token?: string) {
  try {
    console.log('Running scheduled cache maintenance')
    
    const tasks = [
      // Warm critical caches
      fetch('/api/warm-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }),
      
      // Refresh search cache
      revalidationTriggers.updateSearch(token),
      
      // Refresh posts cache
      revalidationTriggers.newPost('', token),
    ]

    const results = await Promise.allSettled(tasks)
    
    return {
      success: true,
      results: results.map((result, index) => ({
        task: ['warm-cache', 'update-search', 'update-posts'][index],
        status: result.status,
        ...(result.status === 'rejected' && { error: result.reason }),
      })),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Scheduled maintenance failed:', error)
    throw error
  }
}

/**
 * Example usage in different scenarios
 */
export const revalidationExamples = {
  // In a CMS webhook handler
  cmsWebhook: `
    // pages/api/webhook/notion.ts
    import { handleNotionWebhook } from '@/services/cache/revalidation-utils'
    
    export default async function handler(req, res) {
      const token = process.env.REVALIDATION_TOKEN
      const result = await handleNotionWebhook(req.body, token)
      res.json(result)
    }
  `,

  // In a deployment script
  deploymentScript: `
    // scripts/post-deploy.js
    import { handleDeploymentComplete } from '@/services/cache/revalidation-utils'
    
    const token = process.env.REVALIDATION_TOKEN
    await handleDeploymentComplete(token)
    console.log('Post-deployment cache refresh completed')
  `,

  // In a scheduled job (e.g., GitHub Actions, cron)
  scheduledJob: `
    // .github/workflows/cache-maintenance.yml
    # Run every 6 hours to keep caches fresh
    name: Cache Maintenance
    on:
      schedule:
        - cron: '0 */6 * * *'
    
    jobs:
      maintain-cache:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - name: Warm caches
            run: |
              curl -X POST https://yourdomain.com/api/warm-cache \\
                -H "Authorization: Bearer \${{ secrets.REVALIDATION_TOKEN }}"
  `,

  // Manual admin trigger
  adminInterface: `
    // In an admin component
    import { revalidationTriggers } from '@/services/cache/revalidation-utils'
    
    const AdminPanel = () => {
      const refreshCache = async (action) => {
        const token = 'your-admin-token'
        await revalidationTriggers[action](token)
        alert('Cache refreshed!')
      }
      
      return (
        <div>
          <button onClick={() => refreshCache('newPost')}>
            Refresh Posts
          </button>
          <button onClick={() => refreshCache('refreshAll')}>
            Refresh All
          </button>
        </div>
      )
    }
  `,
}