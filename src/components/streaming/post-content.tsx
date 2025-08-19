import { notFound } from 'next/navigation'
import { getPostPageData } from '@/lib/parallel-data'
import { NotionRenderer } from '@/components/notion'
import { PostInteractions } from '@/components/post-interactions'

interface PostContentProps {
  path: string
}

// Async Server Component for streaming post content with parallel data fetching
export async function PostContent({ path }: PostContentProps) {
  try {
    // Fetch post data, blocks, and related posts in parallel
    const data = await getPostPageData(path)

    if (!data) {
      notFound()
    }

    const { meta, blocks, relatedPosts } = data

    return (
      <article data-nopico>
        <NotionRenderer blocks={blocks} meta={meta} />
        
        {/* Post interactions with React 19 optimistic updates */}
        <PostInteractions 
          postId={meta.id} 
          initialLiked={false} 
          initialBookmarked={false}
        />
        
        {/* Future enhancement: Related posts section */}
        {/* {relatedPosts.length > 0 && (
          <aside style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5' }}>
            <h3>Related Posts</h3>
            <ul>
              {relatedPosts.map(post => (
                <li key={post.id}>
                  <Link href={`/post/${post.path}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )} */}
      </article>
    )
  } catch (error) {
    console.error('Error loading post content:', path, error)
    notFound()
  }
}