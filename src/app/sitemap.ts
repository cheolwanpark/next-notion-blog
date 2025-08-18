import { MetadataRoute } from 'next'
import { getAllPages } from '@/services/notion/page'
import { config } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getAllPages()
    
    const postUrls = posts.map((post) => ({
      url: `${config.baseURL}/post/${post.path}`,
      lastModified: post.updated ? new Date(post.updated) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get unique tags
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })

    const tagUrls = Array.from(tags).map((tag) => ({
      url: `${config.baseURL}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [
      {
        url: config.baseURL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${config.baseURL}/post`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...postUrls,
      ...tagUrls,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return minimal sitemap on error
    return [
      {
        url: config.baseURL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}