import { SearchablePosts } from "@/components/searchable_posts"
import { config } from "@/config"
import { query } from "@/services/notion/query"
import { PageMeta } from "@/services/notion/types"

export const metadata = {
  title: `All Posts | ${config.blogTitle}`,
  description: "Browse all blog posts",
  openGraph: {
    title: `All Posts | ${config.blogTitle}`,
    description: "Browse all blog posts",
    url: `${config.baseURL}/post`,
  },
}

// Server Component for all posts page
export default async function AllPostsPage() {
  // Fetch all posts with pagination (converted from getStaticProps)
  const PAGES_PER_LOAD = 100
  let response = await query({
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

  return (
    <>
      <h1>All Posts</h1>
      <SearchablePosts posts={pages} size={config.postsPerPage} />
    </>
  )
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900