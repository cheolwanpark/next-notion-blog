import { PageMeta } from "@/services/notion/types";
import styles from "@/styles/posts.module.scss";
import dayjs from "dayjs";
import Link from "next/link";
import { NewLineAppliedText } from "./newlinetext";
import { PaginationControls } from "./pagination-controls";

interface PostsProps {
  posts: PageMeta[];
  size: number;
  currentPage?: number;
}

export const PostsServer = ({ posts, size, currentPage = 0 }: PostsProps) => {
  const startIdx = currentPage * size;
  const currentPosts = posts.slice(startIdx, startIdx + size);
  
  const prevButtonExists = currentPage > 0;
  const nextButtonExists = startIdx + size < posts.length;

  return (
    <>
      <section className={styles.posts}>
        {currentPosts.map((post, idx) => {
          const published = dayjs(post.published).format("MMMM DD, YYYY");
          return (
            <article key={post.id} className={styles.post}>
              <Link
                aria-label={`link to the ${post.title}`}
                href={`/post/${post.path}`}
                className={styles.link}
                data-nopico
              ></Link>
              <hgroup>
                <h1>{post.title}</h1>
                <h2>
                  <NewLineAppliedText content={post.description} />
                </h2>
              </hgroup>
              <ul className={styles.tags}>
                {post.tags.map((tag) => {
                  return (
                    <li key={tag}>
                      <Link
                        href={`/tag/${tag}`}
                        aria-label={`Link to #${tag} page`}
                        data-nopico
                      >
                        #{tag}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className={styles.additional}>
                {`${published} · ${post.author}`}
              </p>
            </article>
          );
        })}
        
        <PaginationControls 
          currentPage={currentPage}
          prevButtonExists={prevButtonExists}
          nextButtonExists={nextButtonExists}
        />
      </section>
    </>
  );
};