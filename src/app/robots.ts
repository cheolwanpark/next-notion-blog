import { MetadataRoute } from 'next'
import { config } from '@/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${config.baseURL}/sitemap.xml`,
  }
}