import { SearchablePosts } from "@/components/searchable_posts"
import { config } from "@/config"
import { getCachedAllTags } from "@/lib/cached-notion"
import { getTagPageData } from "@/lib/parallel-data"
import { notFound } from "next/navigation"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

// Generate static paths for all tags with cached data
export async function generateStaticParams() {
  try {
    const tags = await getCachedAllTags()
    
    return tags.map((tag) => ({
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

// Server Component for tag page with parallel data fetching
export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  try {
    // Fetch tag page data in parallel for better performance
    const data = await getTagPageData(decodedTag)

    if (!data || data.posts.length === 0) {
      notFound()
    }

    const { posts, relatedTags, totalPosts } = data

    return (
      <>
        <h1>#{decodedTag}</h1>
        <p>{totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</p>
        
        <SearchablePosts posts={posts} size={config.postsPerPage} />
        
        {/* Future enhancement: Related tags */}
        {/* {relatedTags.length > 0 && (
          <aside style={{ marginTop: '2rem' }}>
            <h3>Related Tags</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {relatedTags.map(relatedTag => (
                <Link 
                  key={relatedTag} 
                  href={`/tag/${relatedTag}`}
                  style={{ padding: '0.25rem 0.5rem', background: '#f0f0f0', borderRadius: '4px' }}
                >
                  #{relatedTag}
                </Link>
              ))}
            </div>
          </aside>
        )} */}
      </>
    )
  } catch (error) {
    console.error('Error loading tag page:', decodedTag, error)
    notFound()
  }
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900