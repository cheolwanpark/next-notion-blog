import { Suspense } from 'react'
import { config } from "@/config"
import { PostsList } from '@/components/streaming/posts-list'
import { PostsListSkeleton } from '@/components/streaming/posts-list-skeleton'

export const metadata = {
  title: `All Posts | ${config.blogTitle}`,
  description: "Browse all blog posts",
  openGraph: {
    title: `All Posts | ${config.blogTitle}`,
    description: "Browse all blog posts",
    url: `${config.baseURL}/post`,
  },
}

// Server Component with streaming - static shell, dynamic content
// Note: PPR will be enabled when upgrading to Next.js canary
export default function AllPostsPage() {
  return (
    <>
      {/* Static shell - prerendered at build time */}
      <h1>All Posts</h1>
      
      {/* Dynamic content - streamed at request time */}
      <Suspense fallback={<PostsListSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  )
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900