import { Intro } from "@/components/intro"
import { Posts } from "@/components/posts"
import { config } from "@/config"
import { query } from "@/services/notion/query"
import Link from "next/link"
import styles from "@/styles/homepage.module.scss"

// This is now a Server Component - direct data fetching!
export default async function HomePage() {
  // Direct data fetching in component (replaces getStaticProps)
  const response = await query({
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
    page_size: config.previewPosts,
  })

  return (
    <>
      <Intro />
      <Posts posts={response.pages} size={config.previewPosts} />
      <Link
        href="/post"
        className={styles.allposts}
        aria-label="Link to Posts page"
        data-nopico
      >
        All Posts →
      </Link>
    </>
  )
}

// Configure ISR revalidation (15 minutes)
export const revalidate = 900