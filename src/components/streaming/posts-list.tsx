import { config } from "@/config"
import { getAllPostsPageData } from "@/lib/parallel-data"
import { DynamicSearch } from "@/components/dynamic-search"

// Async Server Component for streaming posts list with parallel data fetching
export async function PostsList() {
  // Fetch all posts page data in parallel for better performance
  const { posts, tags, stats } = await getAllPostsPageData()

  return <DynamicSearch posts={posts} size={config.postsPerPage} />
}