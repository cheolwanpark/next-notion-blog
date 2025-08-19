import { config } from "@/config"
import { getAllPostsPageData } from "@/lib/parallel-data"
import { ModernSearchablePosts } from "@/components/modern-searchable-posts"

// Async Server Component for streaming posts list with parallel data fetching
export async function PostsList() {
  // Fetch all posts page data in parallel for better performance
  const { posts, tags, stats } = await getAllPostsPageData()

  return <ModernSearchablePosts posts={posts} size={config.postsPerPage} />
  
  // Future enhancement: could show tag filters or stats
  // return (
  //   <div>
  //     <div>Total posts: {stats.totalPosts}</div>
  //     <ModernSearchablePosts posts={posts} size={config.postsPerPage} />
  //   </div>
  // )
}