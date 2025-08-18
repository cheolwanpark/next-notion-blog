import { SearchablePosts } from "@/components/searchable_posts"
import { config } from "@/config"
import { query } from "@/services/notion/query"
import { getAllPages } from "@/services/notion/page"
import { PageMeta } from "@/services/notion/types"
import { notFound } from "next/navigation"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

// Generate static paths for all tags
export async function generateStaticParams() {
  try {
    const posts = await getAllPages()
    const tags = new Set<string>()
    
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    
    return Array.from(tags).map((tag) => ({
      tag: tag,
    }))
  } catch (error) {
    console.warn('Failed to generate static params for tags:', error)
    return []
  }
}

// Generate metadata for tag pages
export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  return {
    title: `#${decodedTag} | ${config.blogTitle}`,
    description: `Posts tagged with ${decodedTag}`,
    openGraph: {
      title: `#${decodedTag} | ${config.blogTitle}`,
      description: `Posts tagged with ${decodedTag}`,
      url: `${config.baseURL}/tag/${tag}`,
    },
  }
}

// Server Component for tag page
export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  try {
    // Fetch posts filtered by tag (converted from getStaticProps)
    const PAGES_PER_LOAD = 100
    let response = await query({
      query: {
        type: "and",
        tags: [decodedTag],
      },
      sorts: [
        {
          property: "Published",
          direction: "descending",
        },
      ],
      page_size: PAGES_PER_LOAD,
    })
    
    const pages: PageMeta[] = response.pages
    
    // Continue fetching if there are more pages
    while (response.next_cursor) {
      response = await query({
        query: { cursor: response.next_cursor },
        page_size: PAGES_PER_LOAD,
      })
      pages.push(...response.pages)
    }

    // If no posts found for this tag, show not found
    if (pages.length === 0) {
      notFound()
    }

    return (
      <>
        <h1>#{decodedTag}</h1>
        <SearchablePosts posts={pages} size={config.postsPerPage} />
      </>
    )
  } catch (error) {
    console.error('Error loading tag page:', decodedTag, error)
    notFound()
  }
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900