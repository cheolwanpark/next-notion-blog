import { Intro } from "@/components/intro"
import { PostsServer } from "@/components/posts-server"
import { config } from "@/config"
import { getHomepageData } from "@/lib/parallel-data"
import Link from "next/link"
import styles from "@/styles/homepage.module.scss"

// Server Component with parallel data fetching for optimal performance
// Note: PPR will be enabled when upgrading to Next.js canary
export default async function HomePage() {
  // Fetch homepage data
  const homepageData = await getHomepageData(config.previewPosts)
  
  const { posts, popularTags, stats } = homepageData

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