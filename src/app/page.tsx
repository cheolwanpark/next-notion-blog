import { Intro } from "@/components/intro"
import { PostsServer } from "@/components/posts-server"
import { config } from "@/config"
import { getHomepageData } from "@/lib/parallel-data"
import Link from "next/link"
import styles from "@/styles/components/homepage.module.scss"

// Server Component with parallel data fetching for optimal performance
// Note: PPR will be enabled when upgrading to Next.js canary
export default async function HomePage() {
  // Fetch homepage data
  const homepageData = await getHomepageData(config.previewPosts)
  
  // Handle potential null response with fallbacks
  const { posts, popularTags, stats } = homepageData || {
    posts: [],
    popularTags: [],
    stats: { totalPosts: 0, totalTags: 0, recentPostsCount: 0, lastUpdated: new Date().toISOString() }
  }

  return (
    <>
      <Intro />
      <PostsServer posts={posts} size={config.previewPosts} currentPage={0} />
      <Link
        href="/post"
        className={styles.allposts}
        aria-label="Link to Posts page"
        data-nopico
      >
        All Posts →
      </Link>
      
      {/* Popular tags could be added to homepage in the future */}
      {/* <div className={styles.popularTags}>
        {popularTags.slice(0, 3).map(({ tag }) => (
          <Link key={tag} href={`/tag/${tag}`}>#{tag}</Link>
        ))}
      </div> */}
    </>
  )
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900