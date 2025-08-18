import { notFound } from 'next/navigation'
import { query } from '@/services/notion/query'
import { getBlocks } from '@/services/notion/block'
import { getAllPages } from '@/services/notion/page'
import { NotionRenderer } from '@/components/notion'
import { config } from '@/config'
import { Comments } from '@/components/comments'
import { ScrollToTopButton } from '@/components/scrolltotop'

interface PageProps {
  params: Promise<{ path: string }>
}

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    // Get all posts for static generation
    const posts = await getAllPages()
    return posts.map((post) => ({
      path: post.path,
    }))
  } catch (error) {
    console.warn('Failed to generate static params for posts:', error)
    return []
  }
}

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

// Server Component for post page
export default async function PostPage({ params }: PageProps) {
  try {
    const { path } = await params
    const response = await query({
      query: { path },
    })

    if (response.pages.length < 1) {
      notFound()
    }

    const meta = response.pages[0]
    const blocks = await getBlocks(meta.id)

    return (
      <>
        <article data-nopico>
          <NotionRenderer blocks={blocks} meta={meta} />
        </article>
        <Comments title={meta.title} />
        <ScrollToTopButton />
      </>
    )
  } catch (error) {
    const { path } = await params
    console.error('Error loading post:', path, error)
    notFound()
  }
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900