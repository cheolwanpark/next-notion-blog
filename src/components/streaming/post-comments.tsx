import { query } from '@/services/notion/query'
import { DynamicComments } from '@/components/dynamic-comments'
import { DynamicScrollToTop } from '@/components/dynamic-scroll-to-top'

interface PostCommentsProps {
  path: string
}

// Async Server Component for streaming comments section
export async function PostComments({ path }: PostCommentsProps) {
  try {
    // Fetch minimal post data for comments title
    const response = await query({
      query: { path },
    })

    if (response.pages.length < 1) {
      // If post doesn't exist, don't show comments
      return null
    }

    const meta = response.pages[0]

    return (
      <>
        <DynamicComments title={meta.title} />
        <DynamicScrollToTop />
      </>
    )
  } catch (error) {
    console.error('Error loading comments for:', path, error)
    // Gracefully fail - show scroll button but no comments
    return <DynamicScrollToTop />
  }
}