import { PageMeta } from "@/services/notion/types";
import styles from "@/styles/posts.module.css";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

export const Posts = ({ posts, size }: { posts: PageMeta[]; size: number }) => {
  const router = useRouter();
  const { page } = router.query;

  const pageIdx = Number.parseInt(page as string) || 0;
  const startIdx = pageIdx * size;
  const prevButtonExists = pageIdx > 0;
  const nextButtonExists = startIdx + size < posts.length;
  const currentPosts = posts.slice(startIdx, startIdx + size);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });
  const setPageIdx = (idx: number) => {
    const pageIdx = idx > 0 ? idx.toString() : "0";
    router.replace({ query: { ...router.query, page: pageIdx } }, undefined, {
      shallow: true,
    });
  };
  const prev = () => {
    scrollToTop();
    setPageIdx(pageIdx - 1);
  };
  const next = () => {
    scrollToTop();
    setPageIdx(pageIdx + 1);
  };

  return (
    <>
      <section className={styles.posts}>
        {currentPosts.map((post, idx) => {
          const published = dayjs(post.published).format("MMMM DD, YYYY");
          return (
            <article key={idx} className={styles.post}>
              <Link
                aria-label={`link to the ${post.title}`}
                href={`/post/${post.path}`}
                className={styles.link}
                data-nopico
              ></Link>
              <hgroup>
                <h1>{post.title}</h1>
                <h2>{post.description}</h2>
              </hgroup>
              <ul className={styles.tags}>
                {post.tags.map((tag) => {
                  return (
                    <li key={tag}>
                      <Link href={`/tag/${tag}`} data-nopico>
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
        <div className={styles.navigator}>
          {prevButtonExists && (
            <button
              aria-label="previous page"
              className={styles.button}
              style={{ float: "left" }}
              onClick={prev}
              data-nopico
            >
              « PREV
            </button>
          )}
          {nextButtonExists && (
            <button
              aria-label="next page"
              className={styles.button}
              style={{ float: "right" }}
              onClick={next}
              data-nopico
            >
              NEXT »
            </button>
          )}
        </div>
      </section>
    </>
  );
};
