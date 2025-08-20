import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { query } from '@/services/notion/query'
import { getAllPages } from '@/services/notion/page'
import { config } from '@/config'
import { PostContent } from '@/components/streaming/post-content'
import { PostComments } from '@/components/streaming/post-comments'
import { PostContentSkeleton, PostCommentsSkeleton } from '@/components/streaming/loading-skeletons'

interface PageProps {
  params: Promise<{ path: string }>
}

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    // Get all posts for static generation
    const posts = await getAllPages()
    console.log(`Generated static params for ${posts.length} posts`)
    return posts.map((post) => ({
      path: post.path,
    }))
  } catch (error) {
    console.error('Failed to generate static params for posts:', error)
    // Return empty array but allow dynamic params
    return []
  }
}

// Allow dynamic params for posts not pre-generated
export const dynamicParams = true

// Generate metadata dynamically for each post
export async function generateMetadata({ params }: PageProps) {
  try {
    const { path } = await params
    const response = await query({
      query: { path },
    })

    if (response.pages.length < 1) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      }
    }

    const meta = response.pages[0]

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.tags?.join(', '),
      authors: [{ name: config.owner }],
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${config.baseURL}/post/${meta.path}`,
        siteName: config.blogTitle,
        type: 'article',
        publishedTime: meta.published,
        tags: meta.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
      },
    }
  } catch (error) {
    const { path } = await params
    console.warn('Failed to generate metadata for post:', path, error)
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }
}

// Server Component for post page with streaming SSR
export default async function PostPage({ params }: PageProps) {
  try {
    const { path } = await params
    
    // Validate post exists for metadata generation
    const response = await query({
      query: { path },
    })

    if (response.pages.length < 1) {
      notFound()
    }

    // Stream post content and comments in parallel with Suspense
    return (
      <>
        {/* Stream post content with content-aware skeleton */}
        <Suspense fallback={<PostContentSkeleton />}>
          <PostContent path={path} />
        </Suspense>
        
        {/* Stream comments section with minimal skeleton */}
        <Suspense fallback={<PostCommentsSkeleton />}>
          <PostComments path={path} />
        </Suspense>
      </>
    )
  } catch (error) {
    const { path } = await params
    console.error('Error loading post page:', path, error)
    notFound()
  }
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900