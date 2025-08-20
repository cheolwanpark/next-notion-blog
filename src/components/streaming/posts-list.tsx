import { config } from "@/config"
import { getAllPostsPageData } from "@/lib/parallel-data"
import { ModernSearchablePosts } from "@/components/modern-searchable-posts"

// Async Server Component for streaming posts list with parallel data fetching
export async function PostsList() {
  // Fetch all posts page data in parallel for better performance
  const data = await getAllPostsPageData()
  
  // Handle potential null response with fallbacks
  const { posts, tags, stats } = data || {
    posts: [],
    tags: [],
    stats: { totalPosts: 0, totalTags: 0, recentPostsCount: 0, lastUpdated: new Date().toISOString() }
  }

  return <ModernSearchablePosts posts={posts} size={config.postsPerPage} />
}